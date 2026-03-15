import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirs = [
  'src/components/layouts',
  'src/pages/public',
  'src/pages/auth',
  'src/pages/customer',
  'src/pages/farmer',
  'src/pages/admin',
  'src/routes',
  'src/context',
  'src/firebase',
  'src/services',
  'src/hooks',
  'src/utils',
  'src/schemas',
  'src/assets'
];

dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

const createPage = (filepath, name) => {
  const content = `import React from 'react';\n\nconst ${name} = () => {\n  return (\n    <div className="p-8">\n      <h1 className="text-2xl font-bold">${name.replace(/([A-Z])/g, ' $1').trim()}</h1>\n    </div>\n  );\n};\n\nexport default ${name};\n`;
  fs.writeFileSync(path.join(__dirname, filepath), content);
};

// Public
['Home', 'Shop', 'ProductDetails', 'Categories', 'CategoryDetails', 'Offers', 'About', 'Contact', 'NotFound', 'Unauthorized'].forEach(name => createPage(`src/pages/public/${name}.jsx`, name));

// Auth
['Login', 'Signup', 'ForgotPassword'].forEach(name => createPage(`src/pages/auth/${name}.jsx`, name));

// Customer
['Account', 'Orders', 'Wishlist', 'Addresses', 'Cart', 'Checkout'].forEach(name => createPage(`src/pages/customer/${name}.jsx`, name));

// Farmer
['FarmerDashboard', 'FarmerProducts', 'FarmerAddProduct', 'FarmerEditProduct', 'FarmerInventory', 'FarmerOrders', 'FarmerCoupons', 'FarmerEarnings', 'FarmerProfile', 'FarmerSettings'].forEach(name => createPage(`src/pages/farmer/${name}.jsx`, name));

// Admin
['AdminDashboard', 'AdminUsers', 'AdminFarmers', 'AdminProducts', 'AdminCategories', 'AdminOrders', 'AdminBanners', 'AdminCoupons', 'AdminSettings'].forEach(name => createPage(`src/pages/admin/${name}.jsx`, name));

// Layouts
const createLayout = (filepath, name, prefix) => {
  const content = `import React from 'react';\nimport { Outlet } from 'react-router-dom';\n\nconst ${name} = () => {\n  return (\n    <div className="min-h-screen flex flex-col">\n      <header className="bg-white border-b py-4 px-6">\n        <h1 className="text-xl font-bold text-primary-600">FreshMart ${prefix}</h1>\n      </header>\n      <main className="flex-grow p-6">\n        <Outlet />\n      </main>\n      <footer className="bg-gray-100 py-4 text-center mt-auto">\n        <p>© 2026 FreshMart</p>\n      </footer>\n    </div>\n  );\n};\n\nexport default ${name};\n`;
  fs.writeFileSync(path.join(__dirname, filepath), content);
};

createLayout('src/components/layouts/MainLayout.jsx', 'MainLayout', '');
createLayout('src/components/layouts/AuthLayout.jsx', 'AuthLayout', 'Auth');
createLayout('src/components/layouts/FarmerLayout.jsx', 'FarmerLayout', 'Farmer Panel');
createLayout('src/components/layouts/AdminLayout.jsx', 'AdminLayout', 'Admin Panel');

console.log('Scaffolding complete');
