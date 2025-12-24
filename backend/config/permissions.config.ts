const PERMISSIONS = {
  admin: [   
    'list_users',
    'view_profile',
    'edit_profile',
    'remove_user',
    'list_content',
    'view_content',
    'publish_content',
    'edit_content',
    'remove_content',
    'list_categories',
    'add_category',
    'edit_category',
    'remove_category'
  ],
  creator: [
    
    'list_content',
    'view_content',
    'publish_content',
    'edit_content',
    'remove_content',
    'view_profile',
    'edit_profile',
    'deactivate_account'
  ],
  reader: [
    'list_content',
    'view_content',
    'view_profile',
    'edit_profile',
  ]
};

export default PERMISSIONS;
