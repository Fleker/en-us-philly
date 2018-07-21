const getSample = () => {
    const phrases = [
        'I got some sprinkles on my italian ice at the beach.',
        'I\'ve got a lot of baseball stuff in my garage.',
        'Want to get some sandwiches from Subway?',
        'Wow, I\'m hungry for greasy food.',
        'It was a warm summer afternoon, so we bought snow cones.',
        'That video was disgusting.',
        'My friends went to the beach this weekend.',
        'I want some parmesan cheese on my pasta.',
        'I\'d like greasy food without onions.',
        'I want some sprinkles with my ice cream.',
        'All of you are invited to my party.',
        'I need to get $20. Where\'s the nearest ATM?',
        'My friend was very drunk last night and was being weird.',
        'That guy bought new sneakers.',
        'That coffee was alright.',
        'I am doing well. How are you? I\'m awesome.',
        'Yes, I want extra cheese on my sandwich.'
    ]
    return phrases[Math.floor(Math.random() * phrases.length)];
}

const translate = (input) => {
    if (input.length === 0) {
        document.querySelector('#tool-output').innerHTML = '.';
        return;
    }
    
    // Replace words/phrases
    // jawn
    input = input.replace(/stuff(\b)/g, 'jawn$1');
    input = input.replace(/Stuff(\b)/g, 'Jawn$1');
    input = input.replace(/things?(\b)/g, 'jawn$1');
    input = input.replace(/Things?(\b)/g, 'Jawn$1');
    input = input.replace(/collection(\b)/g, 'jawn$1');
    input = input.replace(/Collection(\b)/g, 'Jawn$1');

    // hoagie
    input = input.replace(/sandwiches(\b)/, 'hoagies$1');
    input = input.replace(/Sandwiches(\b)/, 'Hoagies$1');
    input = input.replace(/sandwich(\b)/, 'hoagie$1');
    input = input.replace(/Sandwich(\b)/, 'Hoagie$1');
    input = input.replace(/sub(\b)/, 'hoagie$1');
    input = input.replace(/Sub(\b)/, 'Hoagie$1');

    // Wawa
    input = input.replace(/Subway(\b)/, 'Wawa$1');
    input = input.replace(/sandwich shop(\b)/, 'Wawa$1');
    input = input.replace(/deli(\b)/, 'Wawa$1');

    // shore
    input = input.replace(/beach(\b)/, 'shore$1');
    input = input.replace(/Beach(\b)/, 'Shore$1');

    // jimmies
    input = input.replace(/sprinkles(\b)/, 'jimmies$1');
    input = input.replace(/Sprinkles(\b)/, 'Jimmies$1');

    // ratchet
    input = input.replace(/repugnant(\b)/, 'ratchet$1');
    input = input.replace(/Repugnant(\b)/, 'Ratchet$1');
    input = input.replace(/disgusting(\b)/, 'ratchet$1');
    input = input.replace(/Disgusting(\b)/, 'Ratchet$1');

    // malarkey
    input = input.replace(/nonsense(\b)/, 'malarkey$1');
    input = input.replace(/Nonsense(\b)/, 'Malarkey$1');
    input = input.replace(/shit(\b)/, 'malarkey$1');
    input = input.replace(/Shit(\b)/, 'Malarkey$1');

    // water ice
    input = input.replace(/snow cones?(\b)/, 'water ice$1');
    input = input.replace(/Snow cones?(\b)/, 'Water ice$1');
    input = input.replace(/sorbet(\b)/, 'water ice$1');
    input = input.replace(/Sorbet(\b)/, 'Water ice$1');
    input = input.replace(/italian ice(\b)/, 'water ice$1');
    input = input.replace(/Italian ice(\b)/, 'Water ice$1');

    // cheesesteak
    input = input.replace(/greasy food(\b)/, 'a cheesesteak$1');
    input = input.replace(/Greasy food(\b)/, 'A cheesesteak$1');

    // fam
    input = input.replace(/my friends(\b)/, 'the fam$1');
    input = input.replace(/My friends(\b)/, 'The fam$1');
    
    // whiz
    input = input.replace(/cheese(\b)/, 'whiz$1');
    input = input.replace(/Cheese(\b)/, 'Whiz$1');

    // witout
    input = input.replace(/without( onions)?(\b)/, 'witout$2');
    input = input.replace(/Without( onions)?(\b)/, 'Witout$2');

    // wit
    input = input.replace(/with( onions)?(\b)/, 'wit$2');
    input = input.replace(/With( onions)?(\b)/, 'Wit$2');

    // youse
    input = input.replace(/all of you(\b)/, 'youse$1');
    input = input.replace(/All of you(\b)/, 'Youse$1');
    input = input.replace(/y'all(\b)/, 'youse$1');
    input = input.replace(/Y'all(\b)/, 'Youse$1');

    // MAC
    input = input.replace(/ATM(\b)/, 'MAC machine$1');

    // drawlin'
    input = input.replace(/being weird(\b)/, 'drawlin\'$1');
    input = input.replace(/acting weird(\b)/, 'drawlin\'$1');
    input = input.replace(/acting odd(\b)/, 'drawlin\'$1');
    input = input.replace(/acting unusual(\b)/, 'drawlin\'$1');
    input = input.replace(/inappropriate(\b)/, 'drawlin\'$1');

    // boul
    input = input.replace(/(young )?(boy|guy|man)(\b)/, 'boul$3');
    input = input.replace(/(Young )?([bB]oy|guy|man)(\b)/, 'Boul$3');

    // ard
    input = input.replace(/alright(\b)/, 'ard$1');
    input = input.replace(/Alright(\b)/, 'Ard$1');

    // fine
    input = input.replace(/happy(\b)/, 'fine$1');
    input = input.replace(/sad(\b)/, 'fine$1');
    input = input.replace(/mad(\b)/, 'fine$1');
    input = input.replace(/doing well(\b)/, 'fine$1');
    input = input.replace(/awesome(\b)/, 'fine$1');

    // yeah, no; no, yeah
    input = input.replace(/no(\b)/, 'yeah, no$1');
    input = input.replace(/No(\b)/, 'Yeah, no$1');
    input = input.replace(/yes(\b)/, 'no, yeah$1');
    input = input.replace(/Yes(\b)/, 'No, yeah$1');

    return input;
}