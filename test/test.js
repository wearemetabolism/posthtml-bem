/* jshint mocha: true, maxlen: false */
var posthtml = require('posthtml'),
    bem = require('../index.js'),
    expect = require('chai').expect;

function test(input, output, done) {
    posthtml()
        .use(bem({
            elemPrefix: '__',
            modPrefix: '--'
        }))
        .process(input)
        .then(function(result) {
            expect(output).to.eql(result.html);
            done();
        }).catch(function(error) {
        done(error);
    });
}

describe('Test for block', function() {
    it('Test block', function(done) {
        test(
            '<div block="animal">Animal</div>',
            '<div class="animal">Animal</div>',
            done
        );
    });

    it('Test block in block', function(done) {
        test(
            '<div block="animals"><div block="animal">Animal</div></div>',
            '<div class="animals"><div class="animal">Animal</div></div>',
            done
        );
    });

    it('Test boolean mod for block', function(done) {
        test(
            '<div block="animal" mod="moo">Cow</div>',
            '<div class="animal animal--moo">Cow</div>',
            done
        );
    });

    it('Test boolean mod for block in block', function(done) {
        test(
            '<div block="animals"><div block="animal" mod="moo">Cow</div></div>',
            '<div class="animals"><div class="animal animal--moo">Cow</div></div>',
            done
        );
    });
});

describe('Test for element', function() {
    it('Test elem', function(done) {
        test(
            '<div block="animal"><div element="cow">Cow</div></div>',
            '<div class="animal"><div class="animal__cow">Cow</div></div>',
            done
        );
    });

    it('Test elem in imbricated block 1', function(done) {
        test(
            '<div block="animal"><div element="cow"><div block="mouth"><div element="teeth">Teeth</div></div></div></div>',
            '<div class="animal"><div class="animal__cow"><div class="mouth"><div class="mouth__teeth">Teeth</div></div></div></div>',
            done
        );
    });

    it('Test elem in imbricated block 2', function(done) {
        test(
            '<div block="animal"><div element="cow">Cow</div><div block="bell"><div element="item">item</div></div></div>',
            '<div class="animal"><div class="animal__cow">Cow</div><div class="bell"><div class="bell__item">item</div></div></div>',
            done
        );
    });

    it('Test indirect element', function(done) {
        test(
            '<div block="animal"><div class="group"><div element="cow">Cow</div></div></div>',
            '<div class="animal"><div class="group"><div class="animal__cow">Cow</div></div></div>',
            done
        );
    });

    it('Test indirect element 2', function(done) {
        test(
            '<div block="animal"><div class="group"><div class="subgroup"><div element="cow">Cow</div></div></div></div>',
            '<div class="animal"><div class="group"><div class="subgroup"><div class="animal__cow">Cow</div></div></div></div>',
            done
        );
    });

    it('Test nested element', function(done) {
        test(
            '<div block="animal"><div element="cow"><div element="calf"></div></div></div>',
            '<div class="animal"><div class="animal__cow"><div class="animal__calf"></div></div></div>',
            done
        );
    });

    it('Test boolean mod for element', function(done) {
        test(
            '<div block="animal"><div element="cow" mod="moo">Cow</div></div>',
            '<div class="animal"><div class="animal__cow animal__cow--moo">Cow</div></div>',
            done
        );
    });
});

describe('Test for TWIG support', function() {

	it('Test support for block', function(done) {
		test(
			'<div block="{{ animal }}"><div element="cow">Cow</div></div>',
			'<div class="{{ animal }}"><div class="{{ animal }}__cow">Cow</div></div>',
			done
		);
	});

	it('Test support for element', function(done) {
		test(
			'<div block="animal"><div element="{{ cow }}">Cow</div></div>',
			'<div class="animal"><div class="animal__{{ cow }}">Cow</div></div>',
			done
		);
	});

	it('Test support for mod in block', function(done) {
		test(
			'<div block="animal" mod="{{ moo }}"><div element="cow">Cow</div></div>',
			'<div class="animal animal--{{ moo }}"><div class="animal__cow">Cow</div></div>',
			done
		);
	});

	it('Test support for mod in element', function(done) {
		test(
			'<div block="animal"><div element="cow" mod="{{ color }}">Cow</div></div>',
			'<div class="animal"><div class="animal__cow animal__cow--{{ color }}">Cow</div></div>',
			done
		);
	});

	it('Test support for multiple mod in element', function(done) {
		test(
			'<div block="animal"><div element="cow" mod="big {{ color }}">Cow</div></div>',
			'<div class="animal"><div class="animal__cow animal__cow--big animal__cow--{{ color }}">Cow</div></div>',
			done
		);
	});

	it('Test support for multiple mod in block', function(done) {
		test(
			'<div block="animal" mod="big {{ type }}"><div element="cow">Cow</div></div>',
			'<div class="animal animal--big animal--{{ type }}"><div class="animal__cow">Cow</div></div>',
			done
		);
	});

	it('Test support for complex structure', function(done) {
		test(
			'{% if input.type == "hidden" %}<div block="Input" mod="{{ input.display|default() ? inline : block }}" class="{{ input.class|default() }}"></div>{% endif %}',
			'{% if input.type == "hidden" %}<div class="Input Input--{{ input.display|default() ? inline : block }} {{ input.class|default() }}"></div>{% endif %}',
			done
		);
	});
});