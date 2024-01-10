const { COLLECTION_POST } = require('../utils')
const { db } = require('../utils/firebase')

const getPostByIdDB = async (postId) => {
  const postDoc = await db.collection(COLLECTION_POST).doc(postId).get()

  if (!postDoc.exists) {
    return null
  }

  return {
    id: postDoc.id,
    ...postDoc.data(),
  }
}

module.exports = getPostByIdDB
