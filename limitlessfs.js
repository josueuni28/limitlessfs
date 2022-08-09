const {readFileSync, existsSync} = require('fs');
const { Module } = require('module');
//-----------------------------------------------------------------------------------
String.prototype.__reSplit = function(reg){
    if(typeof reg == 'string') return this.split(reg)

    return this.replace(reg,'_,,_').split('_,,_')
}

Object.defineProperty(Array.prototype, '__aiLearn', {
    value: function(searchElement) {
        
        if (this == null) throw new TypeError('"this" is null or not defined')
        const o = Object(this)

        return o.includes(searchElement)
    }
});

Object.defineProperty(String.prototype, '__aiLearn', {
    value: function(searchElement) {
        
        if (this == null) throw new TypeError('"this" is null or not defined')
        const o = Object(this)
    
        return o == searchElement
    }
});

function reJoin(param) {
    if(isArray(param)) return param.join(' || ')
    return param
}

function format(fmt, ...args) {
    if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
        throw new Error('invalid format string.');
    }
    return fmt.replace(/((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g, (m, str, index) => {
        if (str) {
            return str.replace(/(?:{{)|(?:}})/g, m => m[0]);
        } else {
            if (index >= args.length) {
                throw new Error('argument index is out of range in format');
            }
            return args[index];
        }
    });
}

function gerateRegSplit(param) {
    let str = ('('+param.join(')_,,_(')+')').replace(/[?.*+$|]/g,'\\$&')
    
    str = str.replaceAll('_,,_','|')

    return str
}
function isArray(param) {
    return Array.isArray(param)
}
function replaceChar(param) {
    let repl = param.replace(/[áàã]/g,'a')
    repl = repl.replace(/[éèê]/g,'e')
    repl = repl.replace(/[íìî]/g,'i')
    repl = repl.replace(/[óòõô]/g,'o')
    repl = repl.replace(/[úùû]/g,'u')
    repl = repl.replace(/[ç]/g,'c')

    repl = repl.replace(/[ÁÀÃ]/g,'A')
    repl = repl.replace(/[ÉÈÊ]/g,'E')
    repl = repl.replace(/[ÍÌÎ]/g,'I')
    repl = repl.replace(/[ÓÒÕÔ]/g,'O')
    repl = repl.replace(/[ÚÙÛ]/g,'U')
    repl = repl.replace(/[Ç]/g,'C')

    return repl
}
function ERROR(err) {
    throw err
}
function WARN(msg) {
    if(!module.exports.__defaultValues.hideWarnMsg) console.log(msg)
}
function ThisIsANumber(value) {
    return !Number.isNaN(Number(value))
}

module.exports = {
    __isNotComment(value){
        const inic = value.substring(0,2)
        return !this.__defaultValues.comment.includes(inic)
    },
    __defineDefaultValue(val){
        if(val === Boolean){
            return this.__defaultValues.boolean
        }else if(val === Array){
            return this.__defaultValues.array
        }else if(val === Number){
            return this.__defaultValues.number
        }else if(val == null){
            return null
        }else{ // String
            return ''
        }
    },
    __containsArray(val, obj) {
        let contains = false
        if(obj && obj.hasOwnProperty('default') && obj.default){
            if(val.includes(this.__defaultValues._split)) contains = true
        }else{
            if(isArray(this._config._split)){
                for (const split of this._config._split) {
                    if(val.includes(split)){ contains = true; break }
                }
            }else{
                if(val.includes(this._config._split)) contains = true
            }
            
        }

        return contains
    },
    __checkValue(val){
        if(val){
            const [str] = val
            if(`'"`.includes(str)){
                return String
            }else if(!Number.isNaN(Number(val))){
                return Number
            }else if(val == 'undefined'){
                return undefined
            }else if(val == 'null'){
                return null
            }else if((this.__isConfigEmpty('_split') && this.__containsArray(val,{default:true})) || (!this.__isConfigEmpty('_split') && this.__containsArray(val))){
                return Array
            }else if((!this.__isConfigEmpty('_true') && this._config._true.__aiLearn(val)) || (this.__isConfigEmpty('_true') && this.__defaultValues._true.__aiLearn(val))){
                return Boolean
            }else if(!this.__isConfigEmpty('_false') && this._config._false.__aiLearn(val) || (this.__isConfigEmpty('_false') && this.__defaultValues._false.__aiLearn(val))){
                return Boolean
            }else{
                return String
            }
        }else{
            WARN(format(this.__msg.emplyLineParam, val, this.__defaultValues.emplyLineParam))
            return this.__defaultValues.emplyLineParam
        }
    },
    __seeValue(val) {
        if(val){
            const [str] = val
            if(`'"`.includes(str)){
                return val.replaceAll(/["']/g,'')
            }else if(!Number.isNaN(Number(val))){
                return Number(val)
            }else if(val == 'undefined'){
                return undefined
            }else if(val == 'null'){
                return null
            }else if((!this.__isConfigEmpty('_true') && this._config._true.__aiLearn(val)) || (this.__isConfigEmpty('_true') && this.__defaultValues._true.__aiLearn(val))){
                return true
            }else if(!this.__isConfigEmpty('_false') && this._config._false.__aiLearn(val) || (this.__isConfigEmpty('_false') && this.__defaultValues._false.__aiLearn(val))){
                return false
            }else{
                return val
            }
        }else{
            ERROR(format(this.__msg.errorLineParam, val))
        }
    },
    __removeQMarks() {
        if(this.__isConfigEmpty('_removeQM') || this.__isDefaultValueConfig('_removeQM')){
            this.__txt = this.__txt.replaceAll(/["']/g,'')
        }
    },
    __isConfigEmpty(param){
        return this._config[param] === undefined
    },
    __isBlockDefaultEmpty(index){
        return this._config._blocks[index].default === undefined
    },
    __isDefaultValueConfig(param){
        return this._config[param] === this.__defaultValues[param]
    },
    __isBlockRequire(index){
        if(this._config._blocks[index].require === undefined || this._config._blocks[index].require === true){
            return true
        }
        return false
    },
    __caseSensitive(index){
        if(this._config._blocks[index].caseSensitive === undefined || this._config._blocks[index].caseSensitive === false){
            return false
        }
        return true
    },
    __removeBlanks(){
        this.__lines = this.__lines.filter(line => line.trim() && this.__isNotComment(line.trim()))
    },
    __splitKeys(){
        let split = this.__defaultValues._separator

        if(!this.__isConfigEmpty('_separator') && isArray(this._config._separator)){
            split = new RegExp(gerateRegSplit(this._config._separator),'g')
        }else{
            split = this._config._separator
        }

        for(const l in this.__lines) this.__lines[l] = this.__lines[l].__reSplit(split).map(el => el.trim())
    },
    __convertKeys(){
        for (const l in this.__lines) {
            this.__lines[l][0] = replaceChar(this.__lines[l][0].toLowerCase())
        }
    },
    __analyValues(){
        for (const vli in this._config._blocks) {
            let searched = false
            for (const l in this.__lines) {
                if(this._config._blocks[vli].line.__aiLearn( this.__lines[l][0] )){
                    const name = this._config._blocks[vli].render
                    searched = true
                    
                    this.__lines[l][1] = [replaceChar(this.__lines[l][1]), this.__isBlockRequire(vli)]

                    if(!this.__caseSensitive(vli)){
                        this.__lines[l][1][0] = this.__lines[l][1][0].toLowerCase()
                    }

                    if(this._config._blocks[vli].hasOwnProperty('value')){
                        this[name] = this._config._blocks[vli].value
                    }else{
                        this[name] = this.__checkValue(this.__lines[l][1][0])
                    }

                    this.__lines[l][0] = name
                }
            }
            if(this.__isBlockRequire(vli) && !searched) ERROR(format(this.__msg.lineRequire, reJoin(this._config._blocks[vli].line)))
            if(!searched){
                const value = this._config._blocks[vli].value
                let def = ''
                if(this.__isBlockDefaultEmpty(vli)){
                    if(value === Boolean){
                        def = this.__defaultValues.boolean
                    }else if(value === Array){
                        def = this.__defaultValues.array
                    }else if(value === Number){
                        def = this.__defaultValues.number
                    }else{
                        def = this.__defaultValues.string
                    }
                }else{
                    def = this._config._blocks[vli].default
                }
                this[this._config._blocks[vli].render] = def
            }
        }
    },
    __convertValues(){
        for(const l in this.__lines){
            const keyName = this.__lines[l][0]
            const value = this[keyName]
            const lineVal = this.__lines[l][1][0]
            const require = this.__lines[l][1][1]

            if(!lineVal){
                if(require){
                    ERROR(format(this.__msg.lineRequire, keyName))
                }else{
                    // Verifica se a linha já foi setada para null no __checkValue()
                    if(this[keyName] != null){
                        WARN(format(this.__msg.emplyLineParamSetted, lineVal))
                        this[keyName] = this.__defineDefaultValue(value)
                    }
                }
            }

            if(lineVal)
            if(value === Boolean){
                let setted = false
                if(!this.__isConfigEmpty('_true') && !this.__isDefaultValueConfig('_true')){
                    if(this._config._true.__aiLearn(lineVal)){
                        this[keyName] = true
                        setted = true
                    }
                }else{
                    if(this.__defaultValues._true.__aiLearn(lineVal)){
                        this[keyName] = true
                        setted = true
                    }
                }

                if(!this.__isConfigEmpty('_false') && !this.__isDefaultValueConfig('_false')){
                    if(this._config._false.__aiLearn(lineVal)){
                        this[keyName] = false
                        setted = true
                    }
                }else{
                    if(this.__defaultValues._false.__aiLearn(lineVal)){
                        this[keyName] = false
                        setted = true
                    }
                }

                if(!setted) ERROR(format(this.__msg.errorLineParam, lineVal))

            }else if(value === Array){
                let tempLineVal = lineVal
                if(!this.__isConfigEmpty('_split') && !this.__isDefaultValueConfig('_split')){
                    let igc = '',
                        igCaseInSplit = (!this.__isConfigEmpty('_ignoreCaseInSplit') && !this.__isDefaultValueConfig('_ignoreCaseInSplit')) ? this._config._ignoreCaseInSplit : this.__defaultValues._ignoreCaseInSplit
                        flagSplit = (igCaseInSplit) ? 'gi' : 'g'
                    if(isArray(this._config._split)){
                        igc = gerateRegSplit(this._config._split)
                    }else{
                        igc = '('+this._config._split+')'
                    }
                    const regex = new RegExp(igc, flagSplit) // Colocado a flag para permitir ignorar Case Sensitive no _split[]

                    tempLineVal = tempLineVal.__reSplit(regex).map(el => this.__seeValue(el.trim()))
                    
                }else{
                    tempLineVal = tempLineVal.split(this.__defaultValues._split).map(el => this.__seeValue(el.trim()))
                }
                this[keyName] = tempLineVal

            }else if(value === Number){
                const num = lineVal.replace(',','.')
                if(!ThisIsANumber(num)) ERROR(format(this.__msg.errorLineParam, num))
                this[keyName] = Number(num)
            }else if(value == null){
                this[keyName] = null
            }else{ // val === String
                this[keyName] = lineVal
            }
        }
    },
    __txt: '',
    __defaultValues: {
        _separator: ':',
        _removeQM: true,
        _ignoreCharacter: '',
        _split: ',',
        _true: 'yes',
        _false: 'no',
        _ignoreCaseInSplit: true,
        comment: '>>',
        array: [],
        string: '',
        number: 0,
        boolean: false,
        emplyLineParam: null,
        emplyArrayLineParam: [],
        hideWarnMsg: false,
        encode: null
    },
    __lines: [],
    _config: {},
    __msg:{
        fileNotFound: 'File "{0}" not found. Check file local',
        lineRequire: 'Line {0} Required!',
        emplyLineParam: 'WARN: Line param value: "{0}". Converted for {1}',
        emplyLineParamSetted: 'WARN: Setted line param value: "{0}". Converted for default value.',
        errorLineParam: 'ERROR in param value: "{0}"'
    },
    _read(arq){
        if(!existsSync(arq)) ERROR(format(this.__msg.fileNotFound, arq))

        // Permitir ler em codificações diferentes, como utf-8 e ascii
        this.__txt = readFileSync(arq, {encoding: this.__defaultValues.encode}).toString()

        if(!this.__isConfigEmpty('_ignoreCharacter') && !this.__isDefaultValueConfig('_ignoreCharacter')){
            let igc = ''
            if(isArray(this._config._ignoreCharacter)){
                igc = gerateRegSplit(this._config._ignoreCharacter)
            }else{
                igc = '('+this._config._ignoreCharacter+')'
            }
            const regex = new RegExp(igc,'g')
            this.__txt = this.__txt.replace(regex,'')
        }

        this.__removeQMarks()
        this.__lines = this.__txt.split(/\r?\n/g)
        this.__removeBlanks() // REMOVE LINHAS VAZIAS
        this.__splitKeys()
        this.__convertKeys()
        this.__analyValues()
        this.__convertValues()
        
        delete this.__analyValues
        delete this.__removeQMarks
        delete this.__removeBlanks
        delete this.__isBlockDefaultEmpty
        delete this.__caseSensitive
        delete this.__convertKeys
        delete this.__convertValues
        delete this.__defaultValues
        delete this.__defineDefaultValue
        delete this.__isBlockRequire
        delete this.__isConfigEmpty
        delete this.__seeValue
        delete this.__isNotComment
        delete this.__checkValue
        delete this.__containsArray
        delete this.__isDefaultValueConfig
        delete this.__lines
        delete this.__txt
        delete this.__splitKeys
        delete this._config
        delete this.__msg
        delete this._read
    }
}