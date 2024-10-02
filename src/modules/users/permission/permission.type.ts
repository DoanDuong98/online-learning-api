enum PostsPermission {
  DeletePost = 'DeletePost',
}

enum CategoriesPermission {
  CreateCategory = 'CreateCategory',
}

const Permission = {
  ...PostsPermission,
  ...CategoriesPermission,
};

type Permission = PostsPermission | CategoriesPermission;

export default Permission;
