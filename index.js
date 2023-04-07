const ejs = require('ejs');
const minify = require('html-minifier').minify;
const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
const publicDir = path.join(__dirname, 'public');

// Function to render a single EJS file to HTML
function renderFile(file) {
	const filePath = path.join(viewsDir, file);
	const ejsData = getData(file);
	let html = fs.readFileSync(filePath, 'utf8');

	html = ejs.render((html), ejsData);


	// read views/layout/layout.ejs, replace <%= body %> with html, and render it
	const layoutPath = path.join(viewsDir, 'layout', 'layout.ejs');
	const layoutData = getData('layout/layout.ejs');
	const layout = fs.readFileSync(layoutPath, 'utf8');

	// add the data from the current file to the layout data
	html = ejs.render((layout), Object.assign({}, Object.assign(layoutData, ejsData), { body: html }));
	

	// console.log(fs.readFileSync(filePath, 'utf8'));
	const htmlPath = path.join(publicDir, file.replace('.ejs', '.html'));

	fs.writeFileSync(htmlPath, minify(html, {
		collapseWhitespace: true,
		removeComments: true
	}));
	console.log(`Rendered ${filePath} to ${htmlPath}`);
}

// Function to get data for an EJS file from its corresponding JSON file
function getData(file) {
	const jsonPath = path.join(viewsDir, `${file.replace('.ejs', '')}.json`);
	
	let data = {
		pageTitle: "", // Default page title
		route: "" // Default route
	};
	if (fs.existsSync(jsonPath)) {
		data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
	}

	data.include = (file, options) => {
		const includePath = path.join(viewsDir, file);
		const includeData = getData(file);
		console.log(fs.readFileSync(includePath, 'utf8'));

		return ejs.render(setVariable(fs.readFileSync(includePath, 'utf8')), Object.assign({}, includeData, options));
	};

	return data;

}


// Render all EJS files to HTML when the server starts
fs.readdirSync(viewsDir).forEach((file) => {
	if (file.endsWith('.ejs')) {
		renderFile(file);
	}
});


// open a express server
const express = require('express');
const app = express();

app.use(express.static(publicDir));

// redirect all requests to index.html
// app.get('*', (req, res) => {
// 	res.sendFile(path.join(publicDir, 'index.html'));	
// });

app.listen(3000, () => {
	console.log('Server started on port 3000');
}
);