const fs = require('fs').promises;
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const README_PATH = path.join(ROOT_DIR, 'readme.md');

const readDocsDir = async (dirPath, readmeContent = '') => {
	const items = await fs.readdir(dirPath);

	for (const item of items) {
		const itemPath = path.join(dirPath, item);
		const stat = await fs.stat(itemPath);

		if (stat.isFile()) {
			const fileContent = await fs.readFile(itemPath, 'utf8');
			readmeContent += `${fileContent}\n\n<br />\n\n`;
		} else {
			readmeContent = await readDocsDir(itemPath, readmeContent);
		}
	}

	return readmeContent;
}

(async () => {
	const readmeContent = await readDocsDir(DOCS_DIR);
	const cleanReadmeContent = readmeContent.replace(/\n{2,}$/g, '\n');
	await fs.writeFile(README_PATH, cleanReadmeContent);
})();

