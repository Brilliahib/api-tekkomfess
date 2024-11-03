const {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
} = require("firebase/firestore");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const { v4: uuidv4 } = require("uuid");

const db = getFirestore();
const storage = getStorage();

const uploadImage = async (imageFile) => {
  const storageRef = ref(storage, `images/${imageFile.originalname}`);
  await uploadBytes(storageRef, imageFile.buffer);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

const createMenfess = async (req, res) => {
  const message = req.body.message;
  const images = req.files;

  if (!message) {
    return res.status(400).json({
      statusCode: 400,
      message: "Message is required.",
    });
  }

  try {
    const menfessId = uuidv4();
    const createdAt = new Date();
    const user = req.user;

    if (!user || !user.uid || !user.email || !user.fullname) {
      return res.status(400).json({
        statusCode: 400,
        message: "User information is missing.",
      });
    }

    const userInfo = {
      uid: user.uid,
      email: user.email,
      fullname: user.fullname,
    };

    const imageUrls = await Promise.all(
      Array.isArray(images) ? images.map(uploadImage) : []
    );

    await setDoc(doc(db, "menfess", menfessId), {
      id: menfessId,
      message: message,
      created_at: createdAt,
      user: userInfo,
      images: imageUrls,
      comments: [],
    });

    res.status(201).json({
      statusCode: 201,
      message: "Menfess created successfully",
      data: {
        id: menfessId,
        message,
        created_at: createdAt,
        user: userInfo,
        images: imageUrls,
        comments: [],
      },
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Error creating menfess",
      error: error.message,
    });
  }
};

// Get all menfess
const getAllMenfess = async (req, res) => {
  try {
    const menfessCollection = collection(db, "menfess");
    const menfessSnapshot = await getDocs(menfessCollection);
    const menfessList = menfessSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        message: data.message,
        images: data.images,
        comments: data.comments,
        created_at: data.created_at.toDate(),
        user: {
          uid: data.user.uid,
          email: data.user.email,
          fullname: data.user.fullname,
        },
      };
    });

    res.status(200).json({
      statusCode: 200,
      message: "Menfess retrieved successfully",
      data: menfessList,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: "Error retrieving menfess",
      error: error.message,
    });
  }
};

// Get menfess by ID
const getMenfessById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      statusCode: 400,
      message: "Menfess ID is required.",
    });
  }

  try {
    const menfessDoc = await getDoc(doc(db, "menfess", id));

    if (!menfessDoc.exists()) {
      return res.status(404).json({
        statusCode: 404,
        message: "Menfess not found",
      });
    }

    const data = menfessDoc.data();

    const menfessData = {
      id: menfessDoc.id,
      message: data.message,
      images: data.images,
      comments: data.comments,
      created_at: data.created_at.toDate(),
      user: {
        uid: data.user.uid,
        email: data.user.email,
        fullname: data.user.fullname,
      },
    };

    res.status(200).json({
      statusCode: 200,
      message: "Menfess retrieved successfully",
      data: menfessData,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: "Error retrieving menfess",
      error: error.message,
    });
  }
};

// Add comment to menfess
const addCommentToMenfess = async (req, res) => {
  console.log("Received req.body:", req.body); // Debugging line

  const { id } = req.params;
  const { comment } = req.body; // Destructure to get the comment from req.body
  const user = req.user;

  if (!user || !user.uid || !user.email || !user.fullname) {
    return res.status(400).json({
      statusCode: 400,
      message: "User information is missing.",
    });
  }

  const userInfo = {
    uid: user.uid,
    email: user.email,
    fullname: user.fullname,
  };

  if (!id) {
    return res.status(400).json({
      statusCode: 400,
      message: "Menfess ID is required.",
    });
  }

  // Check if comment is undefined or an empty string
  if (comment === undefined || comment.trim() === "") {
    return res.status(400).json({
      statusCode: 400,
      message: "Comment is required.",
    });
  }

  try {
    const menfessRef = doc(db, "menfess", id);
    const menfessDoc = await getDoc(menfessRef);

    if (!menfessDoc.exists()) {
      return res.status(404).json({
        statusCode: 404,
        message: "Menfess not found",
      });
    }

    const currentComments = menfessDoc.data().comments || [];
    const updatedComments = [
      ...currentComments,
      { userInfo, comment, created_at: new Date() },
    ];

    await updateDoc(menfessRef, { comments: updatedComments });

    // Return the comment directly, removing the object structure
    res.status(200).json({
      statusCode: 200,
      message: "Comment added successfully",
      data: comment,
      created_at: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Error adding comment",
      error: error.message,
    });
  }
};

module.exports = {
  createMenfess,
  getAllMenfess,
  getMenfessById,
  addCommentToMenfess,
};
