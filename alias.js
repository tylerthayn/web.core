require('@js/core')
let Fs = require('fs')
let Path = require('path')

let package = JSON.parse(Fs.readFileSync('./package.json', 'utf-8'))
let folder = Path.resolve(process.cwd(), '../../', package.alias)
CopyFolder(process.cwd(), folder)

// Replace alias name in define statement
let content = Fs.readFileSync(Path.resolve(folder, package.main), 'utf-8')
Fs.writeFileSync(Path.resolve(folder, package.main), content.replace(package.name, package.alias), 'utf-8')

// Replace alias name in README.md
let readme = Fs.readFileSync(Path.resolve(folder, 'README.md'), 'utf-8')
Fs.writeFileSync(Path.resolve(folder, 'README.md'), readme.replace(new RegExp(package.name, 'g'), package.alias), 'utf-8')

UpdateDocs(Path.join(folder, 'docs'), package.name, package.alias)


// Update package.json file
package.name = package.alias
delete package.alias
Fs.writeFileSync(Path.join(folder, 'package.json'), JSON.stringify(package, null, 4), 'utf-8')

// Remove alias script
Fs.unlinkSync(Path.join(folder, 'alias.js'))


function UpdateDocs (folder, name, alias) {
	Fs.readdirSync(folder, {withFileTypes: true}).forEach(entry => {
		if (entry.isFile()) {
			if (entry.name.includes(name)) {
				Fs.renameSync(Path.join(folder, entry.name), Path.join(folder, entry.name.replace(new RegExp(name, 'g'), alias)))
				entry.name = entry.name.replace(new RegExp(name, 'g'), alias)
			}

			let content = Fs.readFileSync(Path.join(folder, entry.name), 'utf-8')
			Fs.writeFileSync(Path.join(folder, entry.name), content.replace(new RegExp(name, 'g'), alias), 'utf-8')
		}
		if (entry.isDirectory()) {
			UpdateDocs(Path.join(folder, entry.name), name, alias)
		}
	})


}

function CopyFolder (src, dest) {
	try {Fs.mkdirSync(dest, {recursive: true})} catch (e) {}
	Fs.readdirSync(src, {withFileTypes: true}).forEach(entry => {
		if (entry.isDirectory()) {
			CopyFolder(Path.join(src, entry.name), Path.join(dest, entry.name))
		}
		if (entry.isFile()) {
			Fs.copyFileSync(Path.join(src, entry.name), Path.join(dest, entry.name))
		}
	})
}


