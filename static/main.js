Array.prototype.safeGet = function(number) {
    if(this.length === 0) {
        return undefined
    }

    const index = number % this.length

    return this[index]
}

function pokrasit(text, seed) {
    const map = {
        // cyrillic
        'А': [ 'A', 'Å', 'Δ', 'Ā', 'Ǟ', 'Ắ' ],
        'Б': [ 'Ђ', 'Ҕ' ],
        'В': [ 'ß', 'Ɓ', 'ᛔ' ],
        'Г': [ 'Ґ' ],
        'Д': [ 'Д', 'D' ],
        'Е': [ 'Ę', 'Ξ', 'Σ' ],
        'Ё': [ 'Ё' ],
        'Ж': [ 'Ж', 'ホ' ],
        'З': [ '3' ],
        'И': [ 'И', 'N', 'Ũ' ],
        'Й': [ 'Й', 'Ũ' ],
        'К': [ 'Ƙ', 'Ҝ' ],
        'Л': [ 'Ԓ', 'Ӆ', 'Ꮑ' ],
        'М': [ 'M', 'ᙢ' ],
        'Н': [ 'H', 'Ħ', 'Ӈ' ],
        'О': [ 'Ѻ', 'Ø', '0', 'Ǿ', 'Õ', 'Ợ', 'Θ' ],
        'П': [ 'П', 'Ԥ' ],
        'Р': [ 'ᑭ', 'Ꭾ', '₽' ],
        'С': [ 'Ç', 'Ը', '亡' ],
        'Т': [ '卞', 'Ţ', 'Ƭ', '₮' ],
        'У': [ 'Ⴘ', 'Ÿ', 'Ⴤ', 'Y' ],
        'Ф': [ '中' ],
        'Х': [ 'X̄', 'Х' ],
        'Ц': [ 'Џ', 'Ц' ],
        'Ч': [ '4' ],
        'Ш': [ 'Ш', 'Ɯ' ],
        'Щ': [ 'Щ' ],
        'Ъ': [ 'Ъ' ],
        'Ы': [ 'ᕊl', 'Ѣł', 'bI' ], 
        'Ь': [ 'ᕊ', 'Ѣ', 'b' ], 
        'Э': [ 'Э' ],
        'Ю': [ 'Ю' ],
        'Я': [ 'Я', 'R' ],

        // latin
        'A': [ 'A', 'Å', 'ʌ', 'Ā', 'Ǟ', 'Ắ' ],
        'B': [ 'ß', 'Ɓ', 'ᛔ' ],
        'C': [ 'Ç', 'Ը', '亡' ],
        'D': [ 'D', 'Δ', 'Ď', 'Ð' ],
        'E': [ 'Ę', 'Ξ', 'Σ' ],
        'F': [ 'F', 'Ꞙ', '₣' ],
        'G': [ 'G', '₲', 'Ǥ', 'Ģ', 'Ꞡ', 'Ɠ' ],
        'H': [ 'H', 'Ħ', 'Ӈ' ],
        'I': [ 'I', 'Î', 'Į̃' ],
        'J': [ 'J', 'Ɉ', 'J̃' ],
        'K': [ 'Ƙ', 'Ҝ' ],
        'L': [ 'L', 'Ⱡ', 'Ł', 'Ļ' ],
        'M': [ 'M', 'ᙢ' ],
        'N': [ 'N', '₦', 'Ɲ', 'Ꞥ' ],
        'O': [ 'Ѻ', 'Ø', '0', 'Ǿ', 'Õ', 'Ợ', 'Θ' ],
        'P': [ 'ᑭ', 'Ꭾ', '₽' ],
        'Q': [ 'Q', 'Ɋ', 'Ꝗ' ],
        'R': [ 'R', '℞', 'Ɽ', 'Ȑ' ],
        'S': [ 'S', '$', 'Ȿ' ],
        'T': [ '卞', 'Ţ', 'Ƭ', '₮' ],
        'U': [ 'U', '∪', 'Ü', 'Ū' ],
        'V': [ 'V', 'Ṽ', 'Ꝟ' ],
        'W': [ 'W', 'Ŵ', 'W̊', 'Ẅ' ],
        'X': [ 'X̄', 'Х' ],
        'Y': [ 'Ⴘ', 'Ÿ', 'Ⴤ', 'Y', 'У' ],
        'Z': [ 'Z', 'Ƶ', 'ℤ', 'Ɀ', 'Ẕ' ],
    }

    return text.split('').map((char, i) => {
        const key = char.toUpperCase()
        if(map[key]) {
            return map[key].safeGet(i * (seed % 10) + seed)
        } else {
            return char
        }
    }).join('')
}

const input     = document.getElementById('input')
const output    = document.getElementById('output')
const clear     = document.getElementById('clear-btn')
const copy      = document.getElementById('copy-btn')

const seed = 5240543 + 78//Math.floor(Math.random() * 10000000)

input.focus()

input.addEventListener('input', () => {
    output.innerText = pokrasit(input.innerText, seed)
})

clear.addEventListener('click', () => {
    input.innerText = ''
    output.innerText = ''
})

copy.addEventListener('click', () => {
    const range = document.createRange()
    range.selectNode(output);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy')
})

if('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(function() {
            console.log("Service Worker Registered");
        })
}