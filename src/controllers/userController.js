const {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} = require("firebase/firestore");

const db = getFirestore();

// Get list of all users without the password field
const getAllUsers = async (req, res) => {
  try {
    const usersCollection = collection(db, "users");
    const userSnapshots = await getDocs(usersCollection);

    const users = userSnapshots.docs.map((doc) => {
      const { password, uid, fullname, email, createdAt } = doc.data();
      return {
        id: uid,
        fullname,
        email,
        createdAt,
      };
    });

    res.status(200).json({
      statusCode: 200,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Error retrieving users",
      error: error.message,
    });
  }
};

// Get details of a specific user by UID without the password field
const getUserByUid = async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({
      statusCode: 400,
      message: "UID is required",
    });
  }

  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    const userDoc = querySnapshot.docs[0];
    const { uid: userUid, fullname, email, createdAt } = userDoc.data();

    res.status(200).json({
      statusCode: 200,
      message: "User details retrieved successfully",
      data: {
        id: userUid,
        fullname,
        email,
        createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Error retrieving user details",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserByUid,
};
