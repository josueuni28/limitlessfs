const {readFileSync, existsSync} = require('fs');
//-----------------------------------------------------------------------------------
function reSplit(el, reg){
    if(typeof reg == 'string') return el.split(reg)

    return el.replace(reg,'_,,_').split('_,,_')
}

function aiLearn(el, search) {
    return (isArray(el)) ? el.includes(search) : el == search 
}

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
    let repl = param.replace(/[áàã]/gi,'a')
    repl = repl.replace(/[éèê]/gi,'e')
    repl = repl.replace(/[íìî]/gi,'i')
    repl = repl.replace(/[óòõô]/gi,'o')
    repl = repl.replace(/[úùû]/gi,'u')
    repl = repl.replace(/[ç]/gi,'c')

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
function isEmply(line) {
    if(line[0] == '\'' || line[0] == '"'){
        const r = line.replace(/ +/g,'')
        if(r.length <= 2) return true
    }
    return false
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
    __checkValue(val, line){
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
            }else if((!this.__isConfigEmpty('_true') && aiLearn(this._config._true, val)) || (this.__isConfigEmpty('_true') && aiLearn(this.__defaultValues._true, val))){
                return Boolean
            }else if((!this.__isConfigEmpty('_false') && aiLearn(this._config._false, val)) || (this.__isConfigEmpty('_false') && aiLearn(this.__defaultValues._false, val))){
                return Boolean
            }else{
                return String
            }
        }else{
            WARN(format(this.__msg.emplyLineParam, line, val, this.__defaultValues.emplyLineParam))
            return this.__defaultValues.emplyLineParam
        }
    },
    __seeValue(val, line) {
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
            }else if((!this.__isConfigEmpty('_true') && aiLearn(this._config._true, val)) || (this.__isConfigEmpty('_true') && aiLearn(this.__defaultValues._true, val))){
                return true
            }else if((!this.__isConfigEmpty('_false') && aiLearn(this._config._false, val)) || (this.__isConfigEmpty('_false') && aiLearn(this.__defaultValues._false, val))){
                return false
            }else{
                return val
            }
        }else{
            ERROR(format(this.__msg.errorLineParam, val, line))
        }
    },
    __removeQMarks() {
        if(!this.__isConfigEmpty('_removeQM') && !this.__isDefaultValueConfig('_removeQM')){
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
        let split = (isArray(this.__defaultValues._separator)) ? new RegExp(gerateRegSplit(this.__defaultValues._separator), 'g') : this.__defaultValues._separator

        if(!this.__isConfigEmpty('_separator'))
            if(isArray(this._config._separator)){
                split = new RegExp(gerateRegSplit(this._config._separator),'g')
            }else{
                split = this._config._separator
            }

        for(const l in this.__lines) this.__lines[l] = reSplit(this.__lines[l], split).map(el => el.trim())
    },
    __convertKeys(){
        for (const l in this.__lines) {
            this.__lines[l][0] = replaceChar(this.__lines[l][0].toLowerCase())
        }
    },
    __convertLines(){
        for (const blk in this._config._blocks) {
            if(isArray(this._config._blocks[blk].line)){
                for(const l in this._config._blocks[blk].line){
                    this._config._blocks[blk].line[l] = replaceChar(this._config._blocks[blk].line[l]).toLowerCase()
                }
            }else{
                this._config._blocks[blk].line = replaceChar(this._config._blocks[blk].line).toLowerCase()
            }
        }
    },
    __analyValues(){
        for (const vli in this._config._blocks) {
            let searched = false
            for (const l in this.__lines) {
                if(aiLearn( this._config._blocks[vli].line, this.__lines[l][0] )){
                    const name = this._config._blocks[vli].render
                    searched = true
                    
                    this.__lines[l][1] = [replaceChar(this.__lines[l][1]), this.__isBlockRequire(vli), this.__lines[l][0]]

                    if(!this.__caseSensitive(vli)){
                        this.__lines[l][1][0] = this.__lines[l][1][0].toLowerCase()
                    }

                    if(this._config._blocks[vli].hasOwnProperty('value')){
                        this[name] = this._config._blocks[vli].value
                    }else{
                        this[name] = this.__checkValue(this.__lines[l][1][0], this.__lines[l][0])
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
            const line = this.__lines[l][1][2]

            if(!lineVal){
                if(require){
                    ERROR(format(this.__msg.lineRequire, line))
                }else{
                    // Verifica se a linha já foi setada para null no __checkValue()
                    if(this[keyName] != null){
                        WARN(format(this.__msg.emplyLineParamSetted, line, lineVal))
                        this[keyName] = this.__defineDefaultValue(value)
                    }
                }
            }

            if(lineVal)
            if(value === Boolean){
                let setted = false
                if(!this.__isConfigEmpty('_true') && !this.__isDefaultValueConfig('_true')){
                    if(aiLearn(this._config._true, lineVal)){
                        this[keyName] = true
                        setted = true
                    }
                }else{
                    if(aiLearn(this.__defaultValues._true, lineVal)){
                        this[keyName] = true
                        setted = true
                    }
                }

                if(!this.__isConfigEmpty('_false') && !this.__isDefaultValueConfig('_false')){
                    if(aiLearn(this._config._false, lineVal)){
                        this[keyName] = false
                        setted = true
                    }
                }else{
                    if(aiLearn(this.__defaultValues._false, lineVal)){
                        this[keyName] = false
                        setted = true
                    }
                }

                if(!setted) ERROR(format(this.__msg.errorLineParam, lineVal, line))

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

                    tempLineVal = reSplit(tempLineVal, regex).map(el => this.__seeValue(el.trim(), line))
                    
                }else{
                    tempLineVal = tempLineVal.split(this.__defaultValues._split).map(el => this.__seeValue(el.trim(), line))
                }
                this[keyName] = tempLineVal

            }else if(value === Number){
                const num = lineVal.replace(',','.')
                if(!ThisIsANumber(num)) ERROR(format(this.__msg.errorLineParam, num, line))
                this[keyName] = Number(num)
            }else if(value == null){
                this[keyName] = null
            }else{ // val === String
                if(isEmply(lineVal)){
                    this[keyName] = ''
                }else{
                    this[keyName] = lineVal
                }
            }
        }
    },
    __goRead(file, enc){
        // Permitir ler em codificações diferentes, como utf-8 e ascii
        this.__txt = readFileSync(file, {encoding: enc}).toString()

        const arqext = file.toLowerCase().slice(-5)
        // Verifica se é JSON
        if(arqext == '.json'){
            const fjson = JSON.parse(this.__txt)
            for(let j in fjson) this[j] = fjson[j]
            
        }else{
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
            this.__convertLines()
            this.__analyValues()
            this.__convertValues()
        }
    },
    __txt: '',
    __defaultValues: {
        _separator: ':',
        _removeQM: false,
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
        hideWarnMsg: false
    },
    __lines: [],
    _config: {},
    __msg:{
        fileNotFound: 'File "{0}" not found. Check file local',
        lineRequire: 'Line {0} Required!',
        emplyLineParam: 'WARN: Line ({0}) param value: "{1}". Converted for {2}',
        emplyLineParamSetted: 'WARN: Line ({0}) with defined value has a "{1}" parameter. Converted for default value.',
        errorLineParam: 'ERROR in param value "{0}", on line: {1}'
    },
    _read(arq, encode = null){
        if(!existsSync(arq)) ERROR(format(this.__msg.fileNotFound, arq))

        this.__goRead(arq, encode)
        
        delete this.__analyValues
        delete this.__removeQMarks
        delete this.__removeBlanks
        delete this.__isBlockDefaultEmpty
        delete this.__caseSensitive
        delete this.__convertKeys
        delete this.__convertLines
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
        delete this.__goRead
        delete this._read
    }
}