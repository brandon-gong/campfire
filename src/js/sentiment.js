// Imports the Google Cloud client library
const language = require('@google-cloud/language');
// Creates a client
const client = new language.LanguageServiceClient();

function getEntitiesAndScore(){
    /**
     * TODO(developer): Uncomment the following line to run this code.
     */
    const text = 'Brandon is such a cool person!';

    // Prepares a document, representing the provided text
    const document = {
    content: text,
    type: 'PLAIN_TEXT',
    };

    let es_pairs = []

    // Detects entities in the document
    client.analyzeEntities({document}).then(
			(result) => {
                const entities = result.entities;

				entities.forEach(entity => {
                    pair = [entity.name, entity.sentiment]
                    es_pairs.push()
                });
		
			},
			(error) => {
				console.log(error);
			}
		);

    console.log(es_pairs)
}

