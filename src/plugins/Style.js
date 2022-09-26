/**
 * Style loader plugin for RequireJs
 *
 * @name style
 * @global
 */
define('style', {
    load: function(name, req, onload, config) {
        let file = name;
        Object.keys(config.paths).forEach(path => {
            file = file.replace(path, config.paths[path]);
        });
        file = file.endsWith('.css') ? file : file + '.css';
        InsertStyle(file, onload);
    }
});