require('@js/core')
let Fs = require('fs')
let Path = require('path')

function Filter(ast,filters){let _ast=ast;filters.Keys().forEach(key=>{_ast=_ast.filter(d=>d[key]==filters[key])});return _ast}
function Sort (a, b) {return a.longname.localeCompare(b.longname, 'en'/*, { sensitivity: 'base' }*/)}
function StringifyParam(param){let s=`${param.name}`;return param.optional?`[${s}]`:s}

let package = JSON.parse(Fs.readFileSync(Path.resolve('./package.json'), 'utf-8'))

module.exports = (ast) => {
	let output = ''
	let log = (s) => {output += s + '\n'}

	log(`\n## ${package.name}  \n`)

	function Process (doclet, ast, indent = 0) {
		try {
			if (doclet.kind == 'class' || doclet.kind == 'module' || doclet.kind == 'namespace') {
				log('\n'+'\t'.repeat(indent)+'### '+doclet.longname+'  \n')

				Filter(ast, {memberof: doclet.longname, scope: 'static', kind: 'class'}).forEach(child => Process(child, ast, indent+1))
				Filter(ast, {memberof: doclet.longname, scope: 'static', kind: 'member'}).forEach(child => Process(child, ast, indent+1))
				Filter(ast, {memberof: doclet.longname, scope: 'static', kind: 'function'}).forEach(child => Process(child, ast, indent+1))
				log('')
				Filter(ast, {memberof: doclet.longname, scope: 'instance', kind: 'member'}).forEach(child => Process(child, ast, indent+1))
				Filter(ast, {memberof: doclet.longname, scope: 'instance', kind: 'function'}).forEach(child => Process(child, ast, indent+1))
				Filter(ast, {memberof: doclet.longname, scope: 'instance', kind: 'class'}).forEach(child => Process(child, ast, indent+1))
				log('')
			} else if (doclet.kind == 'function') {
				log('\t'.repeat(indent)+doclet.name+'('+(doclet.params ? doclet.params.map(p => StringifyParam(p)).join(', ') : '')+')  ')
			} else if (doclet.kind == 'member') {
				log('\t'.repeat(indent)+doclet.name+' '+'{'+doclet.type.names.join('|')+'}  ')
			}
		} catch (e) {
			logj(doclet)
			//process.exit()
		}
	}

	// Filter non comment asts
	ast = ast.filter(t => t.Get('comment', '') != '')

	Filter(ast, {scope: 'global', kind: 'class'}).sort(Sort).forEach(t => {Process(t, ast)})
	log('\n###   \n')
	Filter(ast, {scope: 'global', kind: 'function'}).sort(Sort).forEach(t => {Process(t, ast, 1)})
	Filter(ast, {scope: 'global', kind: 'member'}).sort(Sort).forEach(t => {Process(t, ast, 1)})

	//Filter(ast, {kind: 'module'}).sort(Sort).forEach(t => {Process(t, ast)})
	//Filter(ast, {kind: '').sort(Sort).forEach(t => {Process(t, ast)})

	return output


/*
	_ast.filter(t => t.Get('kind', '') == 'module').sort(Sort).forEach(t => {
		ast.Set(t.longname.replace(/:/g, '.'), t)
	})




	_ast.filter(t => t.Get('kind', '') != 'module' && t.Get('scope', '') != 'global').sort(Sort).forEach(t => {
		ast.Set(t.longname.replace(/\./g, '.static.').replace(/#/g, '.instance.'), t)
	})

	//logj(_ast.Paths().filter(p => p.split('.').length < 4))

	ast.Keys().forEach(key => {
		Output(key, ast)
	})

/*
	log('Globals')
	log(ast.Get('global').Keys().map(k => '\t'+k))

	ast.Keys().filter(k => k != 'module' && k != 'global').forEach(section => {
		log(section)
		ast.Get(section, []).forEach(group => {
			log(group.Keys().map(n => '\t'+n).join('\n'))
		})
		log('\n')
	})
*/
}

function Output (name, ast) {
	log(name)
	//log(Reflect.has(ast[name], 'static'))
	if (Reflect.has(ast[name], 'static')) {
		ast[name].static.Keys().forEach(key => {
			log('\t'+key)
		})
		log('')
	}
	if (Reflect.has(ast[name], 'instance')) {
		log('\tInstance Members')
		Object.keys(ast[name]['instance']).forEach(key => {
			log('\t\t'+key)
		})

	}


}

function Stringify (doclet) {
	if (doclet.kind == 'Function') {
		`${doclet.name}(`
	}

}

//function StringifyFunction (

//function Doclet (doc) {
/*

	Define(this, 'FullName', {get: () => {
		if (doc.scope == 'global') {


		}
		if (doc.memberof === 'undefined') {

	}})

*/
//}
