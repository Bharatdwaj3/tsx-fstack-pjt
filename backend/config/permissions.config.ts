type Permissions= {
    admin:string[];
    writer:string[];
    reader:string[];
}

const PERMISSIONS:Permissions  = {
  admin: [   
      'manage_users',
        'view_users',
        'delete_user',
        'view_writers',
        'list_readers',
        'create_content',
        'view_contents',
        'update_product',
        'delete_product',
        'delete_writer',
        'delete_reader',
        'update_writer',
        'delete_account',
        'list_contents',
        'view_readers',
        'view_reader',
        'delete_reader',
        'show_Content',
        'view_self',
        'update_self',
        'view-self'
  ],
  writer: [
        'list_readers',
        'create_content',
        'view_contents',
        'update_content',
        'delete_content',
        'delete_writer',
        'list_contents',
        'update_writer',
        'show_Content',
        'view-self',
        'view_writer',
        'create_content',
        'delete_content',
        'view_readers',
        'view_writers'
        
  ],
  reader: [
            'list_readers',
        'view_contents',
            'create_content',
            'update_content',
            'delete_account',
        'delete_reader',
        'view_reader',
        'show_Content',
        'view_writers',
        'update_reader',
  ]
};

export default PERMISSIONS;


