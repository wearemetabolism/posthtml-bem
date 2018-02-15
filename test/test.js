/* jshint mocha: true, maxlen: false */
var posthtml = require('posthtml'),
    bem = require('../index.js'),
    expect = require('chai').expect;

function test(input, output, done) {
    posthtml()
        .use(bem({
            elemPrefix: '__',
            modPrefix: '--',
            modDlmtr: '-'
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

    it('Test key_value mod for block', function(done) {
        test(
            '<div block="animal" mod="size:big">Cow</div>',
            '<div class="animal animal--size-big">Cow</div>',
            done
        );
    });

    it('Test key_value + boolean mod for block', function(done) {
        test(
            '<div block="animal" mod="size:big moo">Cow</div>',
            '<div class="animal animal--size-big animal--moo">Cow</div>',
            done
        );
    });

    it('Test key_value mod for block', function(done) {
        test(
            '<div block="animal" mod="size:big horns:two">Cow</div>',
            '<div class="animal animal--size-big animal--horns-two">Cow</div>',
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

    it('Test key_value mod for element', function(done) {
        test(
            '<div block="animal"><div element="cow" mod="size:big">Cow</div></div>',
            '<div class="animal"><div class="animal__cow animal__cow--size-big">Cow</div></div>',
            done
        );
    });

    it('Test key_value + boolean mod for element', function(done) {
        test(
            '<div block="animal"><div element="cow" mod="size:big moo">Cow</div></div>',
            '<div class="animal"><div class="animal__cow animal__cow--size-big animal__cow--moo">Cow</div></div>',
            done
        );
    });

    it('Test key_value mod for element', function(done) {
        test(
            '<div block="animal"><div element="cow" mod="size:big horns:two">Cow</div></div>',
            '<div class="animal"><div class="animal__cow animal__cow--size-big animal__cow--horns-two">Cow</div></div>',
            done
        );
    });
});