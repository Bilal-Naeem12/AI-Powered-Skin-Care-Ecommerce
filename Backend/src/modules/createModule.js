const fs = require('fs');
const path = require('path');

// Function to create a folder and its subdirectories
const createFolderStructure = (moduleName) => {
  const modulePath = path.join(__dirname, moduleName);

  // List of files to be created within the module
  const files = [
    `${moduleName}Model.js`,
    `${moduleName}Controller.js`,
    `${moduleName}Service.js`,
    `${moduleName}Routes.js`,
    `${moduleName}Validator.js`,
    `${moduleName}Utils.js`,
    '__tests__',
  ];

  // Create the module folder
  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
  }

  // Loop through each file and create it inside the module
  files.forEach(file => {
    const filePath = path.join(modulePath, file);
    
    if (!fs.existsSync(filePath)) {
      if (file.includes('__tests__')) {
        // Create __tests__ directory
        fs.mkdirSync(filePath, { recursive: true });
      } else {
        // Create an empty file
        fs.writeFileSync(filePath, `// ${file} for ${moduleName} module\n`);
      }
    }
  });

  console.log(`Module template for ${moduleName} has been created successfully!`);
};

// Get module name from the command line argument
const moduleName = process.argv[2];

if (!moduleName) {
  console.log('Please provide a module name.');
  process.exit(1);
}

// Call the function to create the module structure
createFolderStructure(moduleName);
