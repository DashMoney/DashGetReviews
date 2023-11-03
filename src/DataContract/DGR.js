const Dash = require('dash');

const clientOpts = {
  network: 'testnet',
  
  wallet: {
    mnemonic: 'Put 12 word mnemonic here..', // <- CHECK
    unsafeOptions: {
      skipSynchronizationBeforeHeight: 910000, //<- CHANGE*********
      
    },
  },
};

const client = new Dash.Client(clientOpts);

const registerContract = async () => {
  const { platform } = client;
  const identity = await platform.identities.get(
    'Put the identity id for the mnemonic here..'  // <- CHECK
  );

/*DGR
 $ownerId are not given!! <- 
*/

  const contractDocuments = {
      
    dgrreview: {
      
      type: 'object',
      indices: [
        {//This is Reviewer QUERY (For reviews YOU have written) -> Not currently used in DGR
          name: 'ownerIdAndcreatedAt',
          properties: [{ $ownerId: 'asc' }, { $createdAt: 'asc' }],
          unique: false,
        },        
        { //This is personReviewed QUERY (For who reviews are written about)
          name: 'toIdandcreatedAt',
          properties: [{ toId: 'asc' }, { $createdAt: 'asc' }],
          unique: false,
        },
        
      ],
      properties: {
        review: { 
          type: 'string',
          minLength: 0,
          maxLength: 350,
        },
        rating: {
          type: 'integer',
          minimum: 0,
          maximum: 5, 
        },
        toId: { //This is the personReviewed ownerId
          type: 'array',
          byteArray: true,
          minItems: 32,
          maxItems: 32,
          contentMediaType: 'application/x.dash.dpp.identifier',
        }
      },
      required:['review','rating', 'toId', "$createdAt", "$updatedAt"], 
      additionalProperties: false,
    },

    dgrreply: { //The way dgr works is that only the reviewee makes replies
      type: 'object',
      indices: [      
        {
          name: 'reviewId',
          properties: [{reviewId: 'asc' }],
          unique: false,
        }
        // {
        //   name: 'reviewIdandcreatedAt',
        //   properties: [{reviewId: 'asc' }, {$createdAt: 'asc' }],
        //   unique: false,
        // }
      ],
      properties: {
        
        reply: {
          type: 'string',
          minLength: 1,
          maxLength: 350,
        },
        reviewId: {//this is the review doc Id
          type: 'array',
          byteArray: true,
          minItems: 32,
          maxItems: 32,
          contentMediaType: 'application/x.dash.dpp.identifier',
        },
      },
      required: ['reply','reviewId', "$createdAt", "$updatedAt"], 
      additionalProperties: false,
    },
  };

  const contract = await platform.contracts.create(contractDocuments, identity);
  console.dir({ contract: contract.toJSON() });

  
  await platform.contracts.publish(contract, identity);
  return contract;
  
};


registerContract()
  .then((d) => console.log('Contract registered:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect());
