const compile = (input, toPs) => {
    let code = input;
    if (code.length === 0) {
        return ';'
    }

    // Identify any custom pipes
    const pipe2 = /#``(.+)`/gm;
    const pipe2v = pipe2.exec(input);
    let pipe2fun;
    if (pipe2v && pipe2v[1]) {
        pipe2fun = pipe2v[1];
        // Remove all transpiler directives
        code = code.replace(pipe2, '');
    }

    // Variable declarations
    // let a <=> jawn a
    // const a <=> JAWN a
    if (toPs) {
        code = code.replace(/^(\s*)var(\b)/gm, '$1jwn$2');
        code = code.replace(/^(\s*)const(\b)/gm, '$1jawn$2');
        code = code.replace(/^(\s*)let(\b)/gm, '$1jawn*$2');
    } else {
        code = code.replace(/^(\s*)jwn\s*(\w+)\s*:?([=@])/gm, '$1var $2 $3');
        code = code.replace(/^(\s*)jawn\*\s*(\w+)\s*:?([=@])/gm, '$1let $2 $3');
        code = code.replace(/^(\s*)jawn\s*(\w+)\s*:?([=@])/gm, '$1const $2 $3');
        // code = code.replace(/^(\s*)JAWN\s*(\w+)\s*:?([=@])/gm, '$1const $2 $3');
    }

    // Constructors
    // Arrays: [1,2,3] <=> jawns(1,2,3)
    if (toPs) {
        code = code.replace(/\[(.*)\]/gm, 'jawns($1)');
    } else {
        code = code.replace(/jawns\((.*)\)/gm, '[$1]');
    }

    // Classes
    // class Foo extends Bar  <=>  boul Foo infam Bar
    if (toPs) {
        code = code.replace(/^(class .* )extends(\b)/gm, '$1infam$2');
        code = code.replace(/^(\s*)class(\b)/gm, '$1boul$2');
    } else {
        code = code.replace(/^(boul .* )infam(\b)/gm, '$1extends$2');
        code = code.replace(/^boul(.+)<-/gm, 'boul$1extends');
        code = code.replace(/^(\s*)boul(\b)/gm, '$1class$2');
    }

    // this <=> youse
    // console.log <=> yo.log
    if (toPs) {
        code = code.replace(/this/gm, 'youse');
        // code = code.replace(/console\./gm, 'yo.');
    } else {
        code = code.replace(/youse/gm, 'this');
        // code = code.replace(/yo\./gm, 'console.');
    }

    // Conditionals
    // foo == bar  <=>  foo and bar ard
    // foo != bar  <=>  foo and bar ain't ard
    if (toPs) {
        // code = code.replace(/(\S+)\s*!==?\s*(\w+)/gim, '$1 and $2 ain\'t ard');
        // code = code.replace(/(\S+)\s*==+\s*(\w+)/gim, '$1 and $2 ard');
    } else {
        // code = code.replace(/(.+) and (\w+) ard/gim, '$1 === $2');
        // code = code.replace(/(.+) and (\w+) ain't ard/gim, '$1 !== $2');
    }

    // Methods
    // 'abc'.includes('a')  <=>  'abc'.wit('a')
    // !'abc'.includes('z')  <=>  'abc'.witout('z')
    // 'abc'.indexOf('a')  <=>  'abc'.whereyat('a')
    if (toPs) {
        code = code.replace(/!([\w\d\'\[\],]+)\.includes/gim, '$1.witout');
        code = code.replace(/\.includes/gim, '.wit');
        code = code.replace(/([\w\d\'\[\],]+).indexOf/gim, '$1.whereyat');
    } else {
        code = code.replace(/\.wit\(/gim, '.includes(');
        code = code.replace(/([\w\d\'\[\],]+)\.witout\(/gim, '!$1.includes(');
        code = code.replace(/([\w\d\'\[\],]+)\.whereyat\(/gim, '$1.indexOf(');
    }

    // Misc
    if (toPs) {
        code = code.replace(/javascript(\b)/gi, 'phillyscript$1');
    } else {
        code = code.replace(/phillyscript(\b)/gi, 'javascript$1');
    }

    // PhillyScript transpiler-only modifications
    if (!toPs) {
        // Console
        // :) STRING => console.log(`STRING`);
        code = code.replace(/:\)\s*(.*)$/gm, 'console.log(`$1`)');
        code = code.replace(/:\|\s*(.*)$/gm, 'console.warn(`$1`)');
        code = code.replace(/>?:\(\s*(.*)$/gm, 'console.error(`$1`)');

        // Errors
        // fak! STRING  =>  throw new Error(STRING)
        code = code.replace(/fak!\s*(.*)$/gm, 'throw new Error(`$1`)');

        // Custom pipes
        if (pipe2fun) {
            const pipe2funarr = pipe2fun.split('$arg');
            code = code.replace(/`(`.*`)/gm, `${pipe2funarr[0]}$1${pipe2funarr[1]}`);
        }

        // Math
        // float1 ~~ float2  =>  Math.round(float1) === Math.round(float2)
        code = code.replace(/([\w.]+)\s*~~\s*([\w.]+)/gm, 'Math.round($1) === Math.round($2)');
        // integer!  =>  phillyscript_factorial(integer)
        // Append to the bottom b/c yolo
        const factorialRegex = /(\w+)!/gm;
        if (code.match(factorialRegex))
        code += `function phillyscript_factorial(n) {
            if (isNaN(n) || n <= 0) {
                return -1; // Error
            }
            let product = n;
            while (n > 1) {
                product *= --n;
            }
            return product;
        }`;
        code = code.replace(factorialRegex, 'phillyscript_factorial($1)');
        // x // y  =>  [Math.floor(x/y), x % y]
        code = code.replace(/(\w+)\x20*\/\/\x20*(\w+)/gm, '[Math.floor($1/$2), $1 % $2]');
        // x >> y  =>  x > 10 * y
        code = code.replace(/(\w+)\s*>>(=?)\s*(\w+)/gm, '$1 >$2 (10 * $3)');
        code = code.replace(/(\w+)\s*<<(=?)\s*(\w+)/gm, '(10 * $1) <$2 $3');
        // x >2> y  =>  x > 2 * y
        code = code.replace(/(\w+)\s*>(\d+)>(=?)\s*(\w+)/gm, '$1 >$3 ($4 * $2)');
        code = code.replace(/(\w+)\s*<(\d+)<(=?)\s*(\w+)/gm, '($2 * $1) <$3 $4');
        // Bit-shifting  x .>> y  =>  x >> y
        code = code.replace(/(\w+)\s*\.(<<|>>)\s*(\w+)/gm, '$1 $2 $3');

        // Variables
        // ~a  =>  delete a
        code = code.replace(/^~(\w+)$/gm, '$1 = null');
        // foo := 'bar'  =>  foo = 'bar'
        code = code.replace(/(\w+)\s+:=\s+(.+)/gm, '$1 = $2');
        // foo : 'bar'  =>  foo = 'bar'
        code = code.replace(/(\w+)\s+:\s+(.+)/gm, '$1 = $2');

        // Classes
        // object ~ Class  =>  object instanceof Class
        code = code.replace(/(\w+)\s*~\s*(\w+)/gm, '$1 instanceof $2');
        // jawn* x @ A  =>  const x = new A()
        code = code.replace(/^(\s*)(let|const)(\*?)\s*(\w+)\s*@\s*(\w+)/gm, '$1$2$3 $4 = new $5()');
        // constructor function  =>  new
        code = code.replace(/new\s*\(/gm, 'constructor(');

        // Functions
        // fun#  =>  async fun    (to be converted even further later)
        code = code.replace(/fun#/gm, 'async fun');
        // fun x {   => function x() {
        code = code.replace(/fun (\w+) {/gm, 'function $1() {');
        // fun x(args) {   => function x(args) {
        code = code.replace(/fun (\w+)\s*\(([\w,\s]*)\) {/gm, 'function $1($2) {');
        // const a = { return 1; }  => const a = () => { return 1; }
        code = code.replace(/=\s*{/gm, '= () => {');

        // For loops
        // for (let i = 0:...)  =  for (let i = 0; i < Infintiy; i++)
        code = code.replace(/for\s*\((.*):\.\.\.(.*)\)/gm, 'for ($1:Infinity$2)');
        // for (let i = 0;...)  =  for (let i = 0; i >= -Infintiy; i--)
        code = code.replace(/for\s*\((.*);\.\.\.(.*)\)/gm, 'for ($1:-Infinity$2)');
        // for (let i = 0:1:5)  =>  for (let i = 0; i < 5; i+=1)
        code = code.replace(/for\s*\(let\s*(.*)\s*=\s*(.*):(.*):(.*)\)/gm, 'for (let $1 = $2; $1 < $4; $1+=$3)');
        // for (let i = 0:5)  =>  for (let i = 0; i < 5; i++)
        code = code.replace(/for\s*\(let\s*(.*)\s*=\s*(.*):(.*)\)/gm, 'for (let $1 = $2; $1 < $3; $1++)');
        // for (let i = 10;-1;5)  =>  for (let i = 10; i >= 5; i+=-1)
        code = code.replace(/for\s*\(let\s*(.*)\s*=\s*(.*):(.*):(.*)\)/gm, 'for (let $1 = $2; $1 >= $4; $1+=$3)');
        // for (let i = 10:5)  =>  for (let i = 10; i >= 5; i--)
        code = code.replace(/for\s*\(let\s*(.*)\s*=\s*(.*):(.*)\)/gm, 'for (let $1 = $2; $1 >= $3; $1--)');

        // Objects
        // As functions can be simplified with { code }, 
        // we wrap objects with carats, optionally with curly braces
        code = code.replace(/<{?([\sa-zA-Z0-9:'"\-_]*)}?>/g, '{$1}');

        // Await
        code = code.replace(/([\w\(\)]+)#/gm, 'await $1');

        // Arrays & strings
        // x[1:2]  =>  x.slice(1,2)
        code = code.replace(/(\w+)\[(\d+):(\d+)\]/gm, '$1.slice($2, $3)');
        // x[:2]  =>  x.slice(0,2)
        code = code.replace(/(\w+)\[:(\d+)\]/gm, '$1.slice(0, $2)');
        // x[3:]  =>  x.slice(3,x.length)
        code = code.replace(/(\w+)\[(\d+):\]/gm, '$1.slice($2, $1.length)');
        // x .* 5  =>  x.map(el => el * 5)
        code = code.replace(/\s*\.([+\-*/%])\s*(\w+)/gm, '.map(el => el $1 $2)');

        // Atoms/Symbols
        code = code.replace(/= :(\w+)/gm, '= Symbol.for(\'$1\')');
        code = code.replace(/:(\w+):/gm, 'Symbol.keyFor($1)');

        // Misc
        code = code.replace(/haha, yeah/gm, '');
        code = code.replace(/= maybe\(([\d.]*)\)/gm, '= (Math.random() < $1)');
        code = code.replace(/= maybe\(\)/gm, '= (Math.random() < 0.5)');
        code = code.replace(/= maybe/gm, '= (Math.random() < 0.5)');
        code = code.replace(/\((.*)maybe\(([\d.]*)\)(.*)\)/gm, '($1(Math.random() < $2)$3)');
        code = code.replace(/\((.*)maybe\(\)(.*)\)/gm, '($1(Math.random() < 0.5)$2)');
        code = code.replace(/\((.*)maybe(.*)\)/gm, '($1(Math.random() < 0.5)$2)');
    }

    return code.trim();
}