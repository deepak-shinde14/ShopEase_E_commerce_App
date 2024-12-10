const fs = require('fs');
const path = require('path');

// Helper function to create a directory if it doesn't exist
function createDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    } else {
        console.log(`Directory already exists: ${dirPath}`);
    }
}

// Helper function to create a file if it doesn't exist
function createFile(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
        console.log(`Created file: ${filePath}`);
    } else {
        console.log(`File already exists: ${filePath}`);
    }
}

// Root directory
const rootDir = path.join(__dirname, 'src');

// Directory structure
const structure = {
    components: [
        'Header.js',
        'Footer.js',
        'SearchBar.js',
        'FilterSidebar.js',
        'ProductList.js',
        'ProductCard.js',
        'Wishlist.js',
    ],
    pages: ['LoginPage.js', 'ShoppingPage.js', 'WishlistPage.js'],
    utils: ['dataLoader.js'],
    styles: ['global.css', 'theme.css'],
    files: ['App.js', 'index.js'],
};

// Create the root directory
createDirectory(rootDir);

// Create directories and files
Object.entries(structure).forEach(([key, items]) => {
    if (key === 'files') {
        // Create files in the root directory
        items.forEach(file => createFile(path.join(rootDir, file)));
    } else {
        // Create subdirectories and their files
        const subDir = path.join(rootDir, key);
        createDirectory(subDir);
        items.forEach(file => createFile(path.join(subDir, file)));
    }
});

console.log('Directory structure setup complete.');
