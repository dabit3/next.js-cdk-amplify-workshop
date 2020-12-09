export const getPostById = /* GraphQL */ `
  query getPostById($postId: ID!) {
    getPostById(postId: $postId) {
      id
      title
      content
      owner
    }
  }
`;

export const listPosts = /* GraphQL */ `
  query ListPosts  {
    listPosts {
      id
      title
      content
      owner
    }
  }
`;

export const postsByUsername = /* GraphQL */ `
  query PostsByUsername {
    postsByUsername {
      id
      title
      content
      owner
    }
  }
`;

export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $post: PostInput!
  ) {
    createPost(post: $post) {
      id
      title
      content
      owner
    }
  }
`;

export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $post: UpdatePostInput!
  ) {
    updatePost(post: $post) {
      id
      title
      content
    }
  }
`;

export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $postId: ID!
  ) {
    deletePost(postId: $postId)
  }
`;
