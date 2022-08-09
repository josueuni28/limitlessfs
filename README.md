# limitlessfs
Custom configuration file reader for Node<br>
Leitor de arquivo de configuração personalizado para Node.js
<p>Alternativa para o JSON, se você precisa de um arquivo de configuração personalizado para a aplicação</p>

# como usar
Exemplo:
```js
const limitlessfs = require('./limitlessfs')
// Se você colocou o arquivo em uma pasta diferente, altere o caminho acima

limitlessfs._config = {
	_true: 'sim',
	_false: 'nao',
	_blocks: [
        /* Confirgurar as linhas do seu arquivo */
    ]
}

limitlessfs._read('./arquivo.txt')

// Após o _read() a constante será convertida em um objeto, com os valores que você definiu no "_blocks"
console.log(limitlessfs)

```
O objeto "*._config = { }*" por vezes, pode ficar extenso dependendo da quantidade de linhas que o seu arquivo de configuração tem. Por esse motivo, é aconselhado, definir toda a configuração do **limitlessfs** em um arquivo separado da sua aplicação para não misturar com o seu código, e depois importá-lo em seu projeto.

Exemplo:
```js
// Arquivo configureLimitlessfs.js

const limitlessfs = require('./limitlessfs')

limitlessfs._config = {
	_true: 'sim',
	_false: 'nao',
	_blocks: [
        /* Confirgurar as linhas do seu arquivo */
    ]
}

limitlessfs._read('./arquivo.txt')

// Permitindo a exportação...
module.exports = limitlessfs
```
```js
// No seu Projeto...

const limitlessfs = require('./configureLimitlessfs')

// A constante estará pronta para ser usada como objeto na sua Aplicação
console.log(limitlessfs)
```
Dessa maneira todas as configurações não ficam junto da sua aplicação :)
<p><b>README</b> Em Construção... Novas informações em breve.</p>
<p>Em quanto o README está sendo finalizado, vejo o exemplo de uma configuração completa e o arquivo que é possível ler aplicando essas configurações:</p>

# Exemplo (Provisório)
```js
const limitlessfs = require('./limitlessfs')

// Personalizar as mensagens de ATENÇÃO E ERRO:
limitlessfs.__msg.fileNotFound = 'Não encontrou o arquivo {0}'
limitlessfs.__msg.lineRequire = 'A linha "{0}" é necessária'
limitlessfs.__msg.emplyLineParam = 'ATENÇÃO: Uma linha está "{0}". Vamos converter o valor para "{1}"'
limitlessfs.__msg.errorLineParam = 'ERRO no valor "{0}", passado como parâmetro'
limitlessfs.__msg.emplyLineParamSetted: 'OBS: Linha com valor definido: "{0}". Convertido para valor default.'

// Personalizando as tags de comentário:
limitlessfs.__defaultValues.comment = ['##','>>']

limitlessfs._config = {
	_separator: ['=',':'],
	_true: 'sim',
	_false: 'nao',
	_split: [' ate ',',',' a '],
	_ignoreCharacter: ['?','sobre','!','love'],
	_blocks: [
	{
		line: 'numeros a cercar',
		render: 'range',
		value: Array,
		caseSensitive: true
	},
	{
		line: ['iteracao','pulo','avanco','sequencia'],
		render: 'sequential',
		value: Number,
		require: false,
		default: 1
	},
	{
		line: 'numeros fixos',
		render: 'fixedNum',
		value: Array,
		require: false,
	},
	{
		line: ['numeros excluidos','numeros a excluir','numeros removidos','numeros a remover'],
		render: 'excludeNum',
		value: Array,
		require: false,
	},
	{
        /* IMPORTANTE:
            Por padrão o limitlessfs retira todas as acentuações e converte todo o documento para letras
            minúsculas, assim quando for passar os parâmentos de um linha, informar em minúsculo e
            sem acentuação ou cedilha */
		line: ['combinacoes a excluir','combinacoes excluidas','combinacoes para excluir'],
		render: 'excludeCombinations',
		require: false,
	},
	{
		line: ['comprimento do jogo','comprimento do cartao'],
		render: 'width',
	},
	{
		line: ['total de combinacoes','total de jogos'],
		render: 'total',
		require: false,
		default: 1
	},
	{
		line: ['numeros ordenados','em ordem'],
		render: 'sorted',
		require: false,
	},
	{
		line: ['pode repetir combinacoes','pode ter combinacoes repetidas'],
		render: 'norepeat',
		require: false,
	},
	{
		line: ['nome do arquivo final','nome final do arquivo','arquivo de saida'],
		render: 'filename',
		caseSensitive: true,
		require: false,
		default: 'rand'
	},
	{
		line: ['abrir arquivo quando finalizar','abrir ao finalizar'],
		render: 'openfileFinished',
		require: false,
	}]
}

limitlessfs._read('../configuraV3.txt')
module.exports = limitlessfs
```
