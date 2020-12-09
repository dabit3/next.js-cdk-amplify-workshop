import createPost from './createPost';
import deletePost from './deletePost';
import getPostById from './getPostById';
import listPosts from './listPosts';
import updatePost from './updatePost';
import Post from './Post';
import postsByUsername from './postsByUsername';

type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {
     postId: string,
     post: Post
  },
  identity: {
    username: string
  }
}

exports.handler = async (event:AppSyncEvent) => {
    switch (event.info.fieldName) {
        case "getPostById":
          return await getPostById(event.arguments.postId);
        case "createPost": {
          const { username } = event.identity;
          return await createPost(event.arguments.post, username);
        }
        case "listPosts":
          return await listPosts();
        case "deletePost": {
          const { username } = event.identity;
          return await deletePost(event.arguments.postId, username);
        }
        case "updatePost": {
          const { username } = event.identity;
          return await updatePost(event.arguments.post, username);
        }
        case "postsByUsername": {
          const { username } = event.identity;
          return await postsByUsername(username);
        }
        default:
          return null;
    }
}