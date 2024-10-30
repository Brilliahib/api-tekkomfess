const {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} = require("firebase/firestore");
const { v4: uuidv4 } = require("uuid");

const db = getFirestore();

// Create a new menfess
const createMenfess = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      statusCode: 400,
      message: "Message are required.",
    });
  }

  try {
    const menfessId = uuidv4();
    const createdAt = new Date();
    const user = req.user;

    await setDoc(doc(db, "menfess", menfessId), {
      id: menfessId,
      message,
      created_at: createdAt,
      user,
    });

    res.status(201).json({
      statusCode: 201,
      message: "Menfess created successfully",
      data: {
        id: menfessId,
        message,
        created_at: createdAt,
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
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
    const menfessList = menfessSnapshot.docs.map((doc) => doc.data());

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

    res.status(200).json({
      statusCode: 200,
      message: "Menfess retrieved successfully",
      data: menfessDoc.data(),
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: "Error retrieving menfess",
      error: error.message,
    });
  }
};

module.exports = {
  createMenfess,
  getAllMenfess,
  getMenfessById,
};
