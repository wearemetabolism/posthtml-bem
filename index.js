module.exports = function (config) {
    'use strict';

    var _createBlockClass,
        _createElemClass,
        _createModClass,
        _createClassList,
	    _parseChildren,
        _assignClassList;

    config = config ||
        {
            elemPrefix: '__',
            modPrefix: '--',
            modDlmtr: '-'
        };

    _createBlockClass = function (block) {
        return block;
    };

    _createElemClass = function (blockClass, elemName) {
        return blockClass + config.elemPrefix + elemName;
    };

    _createModClass = function (baseClass, mod) {
        var className = '',
            modClass;

	    //escape space in twig variable
        mod = mod.replace(/\s+(?=[^\{\}]*\})/g, '@@');

        mod
            .replace(/\s{2,}/g, ' ') // remove more than one whitespace
            .replace(/\:\s?/g, config.modDlmtr) // remove whitespace after the semicolon
            .split(' ')
            .forEach(function (mod) {
	            //un-escape space
            	mod = mod.replace(/@@/g, ' ');
                modClass = baseClass + config.modPrefix + mod;
                className += ' ' + modClass;
            });
        return className;
    };

    _createClassList = function (selector) {
        var result = '',
            block,
            elem;

        if (selector.block && !selector.element) {
            block = _createBlockClass(selector.block);
            result = block;
        }

        if (selector.block && selector.element) {
            elem = _createElemClass(selector.block, selector.element);
            result = elem;
        }

        if (selector.mod) {
            result += _createModClass(result, selector.mod);
        }

        return result;
    };

    _assignClassList = function (attributes, node) {

        if( typeof attributes === 'undefined' )
            return;

        var classes,
            classSet = {
                block: '',
                element: '',
                mod: ''
            };

        ['block', 'element', 'mod'].forEach(function (attr) {
            if (attr in attributes) {
                classSet[attr] = attributes[attr];
                delete node.attrs[attr];
            }
        });

        classes = _createClassList(classSet);

        if (classes) {
            node.attrs.class = node.attrs.class ?
                [classes, node.attrs.class].join(' ') :
                classes;
            return classSet;
        }
    };

	_parseChildren = function(node, blockClass){

		var nodeAttrs;
		nodeAttrs = _assignClassList(node.attrs, node);

		if(!nodeAttrs)
		    nodeAttrs = {block:blockClass};

		if (node.content && typeof node.content === 'object') {
			node.content.forEach(function (children) {
				if (children.attrs && children.attrs.element && !children.attrs.block) {
					children.attrs.block = nodeAttrs.block;
				}
				_parseChildren(children, nodeAttrs.block);
			});
		}
	};

    return function posthtmlBem(tree) {
        tree.match({attrs: {block: true}}, function (node) {
	        _parseChildren(node);
	        return node;
        });
        return tree;
    };
};
