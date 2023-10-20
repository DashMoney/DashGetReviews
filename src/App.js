import React from "react";
import LocalForage from "localforage";

import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

import DashBkgd from "./Images/dash_digital-cash_logo_2018_rgb_for_screens.png";

import Spinner from "react-bootstrap/Spinner";
//import Form from "react-bootstrap/Form";
//import Alert from "react-bootstrap/Alert";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TopNav from "./Components/TopNav/TopNav";

import TabsOnPage from "./Components/Pages/TabsOnPage";
import CreditsOnPage from "./Components/Pages/CreditsOnPage";
import LowCreditsOnPage from "./Components/Pages/LowCreditsOnPage";

import NameSearchForm from "./Components/Pages/NameSearchForm";
import RatingSummary from "./Components/RatingSummary";

import AddOrEditReviewButton from "./Components/Pages/AddOrEditReviewButton";

import Reviews from "./Components/Pages/Reviews";

import YourReviews from "./Components/YourReviews/YourReviews";

import Footer from "./Components/Footer";

import ConnectWalletModal from "./Components/TopNav/ConnectWalletModal";
import LogoutModal from "./Components/TopNav/LogoutModal";

import TopUpIdentityModal from "./Components/TopUpIdentityModal";

import CreateReviewModal from "./Components/Modals/CreateReviewModal";
import EditReviewModal from "./Components/Modals/EditReviewModal";

import CreateReplyModal from "./Components/Modals/CreateReplyModal";
import EditReplyModal from "./Components/Modals/EditReplyModal";

import "./App.css";

const Dash = require("dash");

const {
  Essentials: { Buffer },
  PlatformProtocol: { Identifier },
} = Dash;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,

      whichTab: "Search", //Search and Your Reviews

      isLoading: true, //For identity and name And not identityInfo that is handle on display component
      isLoadingWallet: true, //For wallet for topup

      isLoadingSearch: false, 
      isLoadingYourReviews: true, 

      mode: "dark",

      presentModal: "",
      isModalShowing: false,
      whichNetwork: "testnet",

      nameToSearch: '',
      nameFormat: false,

      isTooLongNameError: false, //Pass to form and add -> 

      YourReviews1: false,
      YourReviews2: false,

      YourReviews: [
      //   {
      //   $ownerId: '4h5j6j',
      //   $id: '7ku98rj',
      //   review: 'Good service, would eat here again!',
      //   rating: 5,
      //   toId: 'fjghtyru',
      //   $createdAt: Date.now() - 1000000,
      // },
    ],

      YourReviewNames: [
      //   {
      //   $ownerId: '4h5j6j',
      //   label: 'Alice'
      // },
    ],

      YourReplies: [
      //   {
      //   $ownerId: 'ui443fui',
      //   $id: 'klsui4312',
      //   reply: 'Thanks Alice',
      //   reviewId: '7ku98rj',
      //   $createdAt: Date.now() - 300000,
      // },
    ],
      //^^ Doesn't need names because they are only your replies.. -> yes

      SearchedNameDoc: {
        $ownerId: 'E98BXqGj6hNENCCnDmvXzCzmTCSgkBzEU3R18tfW1v2x',
        label: 'BurgerJoint'
      }, 

      SearchedReviews:  [{
        $ownerId: '4h5j6j',
        $id: '7ku98rj',
        review: 'Good service, would eat here again!',
        rating: 5,
        toId: 'fjghtyru',
        $createdAt: Date.now() - 1000000,
      },],


      Search1: false,
      Search2: false,


      SearchedReviewNames: [{
        $ownerId: '4h5j6j',
        label: 'Alice'
      },],

      SearchedReplies: [
        {
          $ownerId: 'E98BXqGj6hNENCCnDmvXzCzmTCSgkBzEU3R18tfW1v2x',
          $id: 'klsui4312',
          reply: 'Thanks Alice',
          reviewId: '7ku98rj',
          $createdAt: Date.now() - 300000,
        },
      ],
      //^^^ Doesn't need name because only the owner can reply.. nice

      reviewToEdit: [], //use a function to find and pass to modal -> 
      reviewToEditIndex: '',

      replyReview:[], //This is for the create reply reviewId
      replyToEdit:[],
      replyingToName: '',


      mnemonic: "",
      identity: '',
      identityInfo: "",
      identityRaw: "",
      uniqueName: "",

      accountBalance: "",

      walletId: "",
      mostRecentLogin: false,
      platformLogin: false, //Will this be used? -> check ->
      LocalForageKeys: [],

      skipSynchronizationBeforeHeight: 910000,
      mostRecentBlockHeight: 910000,

      DataContractDGR: '6MLeoRrsSr4DKV4zT1pSdsDBUhzaGACCbarGzbZyvyyT',
      DataContractDPNS: "GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec",

      expandedTopNav: false,
    };
  }

  closeTopNav = () => {
    this.setState({
      expandedTopNav: false,
    });
  };

  toggleTopNav = () => {
    if (this.state.expandedTopNav) {
      this.setState({
        expandedTopNav: false,
      });
    } else {
      this.setState({
        expandedTopNav: true,
      });
    }
  };

  handleTab = (eventKey) => {
    if (eventKey === "Search")
      this.setState({
        whichTab: "Search",
      });
    else {
      this.setState({
        whichTab: "Your Reviews",
      });
    }
  };


  handleOnChangeValidation = (event) => {
    // this.setState({
    //   isTooLongNameError:false,
    // });

    if (event.target.id === "validationCustomName") {
      this.nameValidate(event.target.value);
    }

  };

  nameValidate = (nameInput) => {
    let regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]$/;
    let valid = regex.test(nameInput);

    if (valid) {
        this.setState({
          nameToSearch: nameInput,
          nameFormat: true,
        });
    } else {
      //isTooLongNameError => Add if statement here =>
      this.setState({
        nameToSearch: nameInput,
        nameFormat: false,
      });
    }
  };

  searchName = () => {

    //add spinner start -> connect ->
    // clear previous results -> 

    this.setState({ 
      isLoadingSearch: true,
      SearchedReviews: [],
    });

    const client = new Dash.Client(this.state.whichNetwork);

    const retrieveName = async () => {
      // Retrieve by full name (e.g., myname.dash)
      console.log(this.state.nameToSearch);
      return client.platform.names.resolve(`${this.state.nameToSearch}.dash`);
    };

    retrieveName()
      .then((d) => {
        if (d === null) {
          console.log("No DPNS Document for this Name.");
          this.setState({
            SearchedNameDoc: 'No NameDoc', //Handle if name fails -> 
            isLoadingSearch: false,
          });
        } else {
          let nameDoc = d.toJSON();
          console.log("Name retrieved:\n", nameDoc);

          this.startSearch(nameDoc.$ownerId);

          this.setState({
            SearchedNameDoc: nameDoc,
            });
        }
      })
      .catch((e) => {
        this.setState({
          SearchedNameDoc: 'No NameDoc',
          isLoadingSearch: false,
        });
        console.error("Something went wrong:\n", e);
        
      })
      .finally(() => client.disconnect());
  };


  hideModal = () => {
    this.setState({
      isModalShowing: false,
    });
  };

  showModal = (modalName) => {
    this.setState({
      presentModal: modalName,
      isModalShowing: true,
    });
  };

  handleMode = () => {
    if (this.state.mode === "primary")
      this.setState({
        mode: "dark",
      });
    else {
      this.setState({
        mode: "primary",
      });
    }
  };

  handleEditReview = (review, index) => {
    this.setState(
      {
        reviewToEdit: review,
        reviewToEditIndex: index
      },
      () => this.showModal('EditReviewModal')
    );
  };

  // &&&    &&&   &&&   &&&   &&&   &&&   &&&&

  handleLogout = () => {
    this.setState(
      {
        isLoggedIn: false,

      whichTab: "Search", 

      isLoading: true, 
      isLoadingWallet: true, //For wallet for topup

      isLoadingSearch: false, 
      isLoadingYourReviews: true, 

      mode: "dark",

      presentModal: "",
      isModalShowing: false,
      whichNetwork: "testnet",

      nameToSearch: '',
      nameFormat: false,

      isTooLongNameError: false,

      YourReviews1: false,
      YourReviews2: false,

      YourReviews: [
          ],

      YourReviewNames: [
          ],

      YourReplies: [
         ],
     

      SearchedNameDoc: {
        $ownerId: 'yrVfHiMoMktJSFpanAvaz25c3ghWd1MQegrsDvcFJVU',
        label: 'BurgerJoint'
      }, 

      SearchedReviews:  [{
        $ownerId: '4h5j6j',
        $id: '7ku98rj',
        review: 'Good service, would eat here again!',
        rating: 5,
        toId: 'fjghtyru',
        $createdAt: Date.now() - 1000000,
      },],


      Search1: false,
      Search2: false,


      SearchedReviewNames: [{
        $ownerId: '4h5j6j',
        label: 'Alice'
      },],

      SearchedReplies: [
        {
          $ownerId: 'ui443fui',
          $id: 'klsui4312',
          reply: 'Thanks Alice',
          reviewId: '7ku98rj',
          $createdAt: Date.now() - 300000,
        },
      ],
      

      reviewToEdit: [], 
      reviewToEditIndex: '',

      replyReview:[], 
      replyToEdit:[],
      replyingToName: '',


      mnemonic: "",
      identity: '',
      identityInfo: "",
      identityRaw: "",
      uniqueName: "",

      accountBalance: "",

      walletId: "",
      mostRecentLogin: false,
      platformLogin: false, //Will this be used? -> check ->
      LocalForageKeys: [],

      skipSynchronizationBeforeHeight: 910000,
      mostRecentBlockHeight: 910000,

      expandedTopNav: false,
      }
      //,() => this.componentDidMount()
    );
  };

  //   componentDidMount() {
  // //All componentDidMount will do is call the initial queries -> okay then how will the login work ? So it really just needs platform and not wallet.

  // //THOUGHT <- wHAT IF i DO ONE PULL FOR THE INITIAL AND THEN SORT SO INSTEAD OF UP TO 10 ITS JUST 2 AND THEN i CAN DO A MOST RECENT BECAUSE PEOPLE WILL BE LOGGING IN FAIRLY QUICKLY..
  // //mAKE IT FAT. <- OKAY AND ITS HOW IT IS SET UP ANYWAY DOUBLE WIN

  //     LocalForage.config({
  //       name: "dashmoney-platform-login",
  //     });

  //     LocalForage.getItem("mostRecentWalletId")
  //       .then((val) => {
  //         if (val !== null) {
  //           this.handleInitialQuerySeq(val.identity);
  //           this.setState({
  //             walletId: val.walletId,
  //             identity: val.identity,
  //             uniqueName: val.name,
  //           });
  //         } else {
  //           console.log("There is no mostRecentWalletId");
  //         }
  //       })
  //       .catch(function (err) {
  //         console.log(err);
  //       });

  // //***Next Bit Gets MostRecentBlockHeight */ //tHIS IS FOR THE PLATFORM LOGIN BC THE OFFLINE WALLET GRAB JUST GETS THE WALLETID.. OKAY THEN WHAT DO i NEED THE MOST RECENT FOR THEN? TO GET THE IDENTITYiNFO??
  // //iS THIS MORE LIKE dso AND NOT dgp, they are actually pretty similar
  //     const clientOpts = {
  //       network: this.state.whichNetwork,
  //     };
  //     const client = new Dash.Client(clientOpts);

  //     const getMostRecentBlockHeight = async () => {
  //       const status = await client.getDAPIClient().core.getStatus();

  //       return status;
  //     };

  //     getMostRecentBlockHeight()
  //       .then((d) => {
  //         let blockHeight = d.chain.blocksCount;
  //         console.log("Most Recent Block Height:\n", blockHeight);
  //         this.setState({
  //           mostRecentBlockHeight: blockHeight - 6,
  //         });
  //       })
  //       .catch((e) => {
  //         console.error("Something went wrong:\n", e);
  //       })
  //       .finally(() => client.disconnect());

  // //Next Part Gets keys for platform login check
  //     LocalForage.keys()
  //       .then((keys) => {
  //         this.setState({
  //           LocalForageKeys: keys,
  //         });
  //         console.log('Local Forage keys:\n', keys);
  //       })
  //       .catch(function (err) {
  //         console.log(err);
  //       });

  //       this.getActiveOrders(); //CHANGE THIS AND GET THE INITIAL QUERIES

  //   }

  handleInitialQuerySeq = (theIdentity) => {
    this.getYourReviews(theIdentity);
  };

  handleWalletConnection = (theMnemonic) => {
    if (this.state.LocalForageKeys.length === 0) {
      this.setState(
        {
          isLoggedIn: true,
          isLoading: true,
          mnemonic: theMnemonic,
        },
        () => this.getIdentitywithMnem(theMnemonic)
      );
    } else {
      this.setState(
        {
          isLoggedIn: true,
          isLoading: true,
          mnemonic: theMnemonic,
        },
        () => this.checkPlatformOnlyLogin(theMnemonic)
      );
    }
  };

  checkPlatformOnlyLogin = (theMnemonic) => {
    console.log("Called Check Platform Login");

    const clientOpts = {
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: theMnemonic,
        offlineMode: true,
      },
    };

    const client = new Dash.Client(clientOpts);

    let walletIdToTry;

    const getWalletId = async () => {
      const account = await client.getWalletAccount();

      walletIdToTry = account.walletId;
      //console.log("walletIdToTry:", walletIdToTry);

      return walletIdToTry === this.state.walletId;
    };

    getWalletId()
      .then((mostRecentMatch) => {
        console.log(`Most Recent Matches -> ${mostRecentMatch}`);

        if (!mostRecentMatch) {
          let isKeyAvail = this.state.LocalForageKeys.includes(walletIdToTry);
          // console.log(`LocalForage Test -> ${isKeyAvail}`);

          if (isKeyAvail) {
            console.log("This here is a login skip!!");

            LocalForage.getItem(walletIdToTry)
              .then((val) => {
                //  console.log("Value Retrieved", val);

                if (
                  val !== null ||
                  typeof val.identity !== "string" ||
                  val.identity === "" ||
                  val.name === "" ||
                  typeof val.name !== "string"
                ) {
                  this.setState(
                    {
                      platformLogin: true,
                      identity: val.identity,
                      uniqueName: val.name,
                      walletId: walletIdToTry,
                      recentOrders: [],
                      isLoading: false,
                      isLoadingRecentOrders: true,
                      //maintain Loading bc continuing to other functions
                    },
                    () => this.handleStartQuerySeq(val.identity, theMnemonic)
                  );

                  let lfObject = {
                    walletId: walletIdToTry,
                    identity: val.identity,
                    name: val.name,
                  };
                  LocalForage.setItem("mostRecentWalletId", lfObject)
                    .then((d) => {
                      //return LocalForage.getItem(walletId);
                      // console.log("Return from LF setitem:", d);
                    })
                    .catch((err) => {
                      console.error(
                        "Something went wrong setting to localForage:\n",
                        err
                      );
                    });
                } else {
                  //  console.log("platform login failed");
                  //this.getIdentitywithMnem(theMnemonic);
                  //() => this.getNamefromIdentity(val)); // send to get it
                }
              })
              .catch((err) => {
                console.error(
                  "Something went wrong getting from localForage:\n",
                  err
                );
              });
          } else {
            this.setState(
              {
                //This is for if no platform login at all. resets
                identityInfo: "",
                identityRaw: "",
                uniqueName: "",
                recentOrders: [],
                isLoading: true,
                isLoadingRecentOrders: true,
              },
              () => this.getIdentitywithMnem(theMnemonic)
            );
          }
        } //Closes mostRecentMatch
        else {
          this.setState(
            {
              mostRecentLogin: true,
              platformLogin: true,
              isLoading: false,
            },
            () => this.handleMostRecentLogin(theMnemonic)
          );
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  /* ************************************************************** */

  //thIS IS A VERY SIMPLE lOGIN -> THERE IS A WHOLE LOT OF NOTHING

  handleMostRecentLogin = (theMnemonic) => { 
    
    this.getYourReviews(this.state.identity);
    this.getIdentityInfo(this.state.identity);
    this.getWalletwithMnem(theMnemonic);
  };

  handleStartQuerySeq = (theIdentity, theMnemonic) => { //USED BY MOSTRECENT AND PLATFORM LOGIN BECAUSE YOU HAVE THE IDENTITY AND NAME.
    this.getYourReviews(theIdentity);
    this.getIdentityInfo(theIdentity);
    this.getWalletwithMnem(theMnemonic);
  };

  getIdentitywithMnem = (theMnemonic) => {
    const client = new Dash.Client({
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: theMnemonic,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: this.state.mostRecentBlockHeight,
        },
      },
    });

    let walletIdToTry;

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();

      //console.log(account);
      // this.setState({
      //   accountAddress: account.getUnusedAddress().address, //This can be used if you havent created the DGMDocument <-
      // });

      walletIdToTry = account.walletId;
      // console.log(walletIdToTry);

      return account.identities.getIdentityIds();
    };

    retrieveIdentityIds()
      .then((d) => {
        // console.log("Mnemonic identities:\n", d);
        //This if - handles if there is an identity or not
        if (d.length === 0) {
          this.setState({
            isLoading: false,
            identity: "No Identity",
          });
        } else {
          this.setState(
            {
              walletId: walletIdToTry,
              identity: d[0],
              isLoading: false,
              //maintain Loading bc continuing to other functions
            },
            () => this.callEverythingBcHaveIdentityNow(d[0], theMnemonic)
          );
        }
      })
      .catch((e) => {
        console.error("Something went wrong getting IdentityIds:\n", e);
        this.setState({
          isLoading: false,
          identity: "No Identity",
        });
      })
      .finally(() => client.disconnect());
  };

  callEverythingBcHaveIdentityNow = (theIdentity, theMnemonic) => {
    if (!this.state.platformLogin) {
      this.getYourReviews(theIdentity);
      this.getNamefromIdentity(theIdentity);
      this.getIdentityInfo(theIdentity);
    }
    
    this.getWalletwithMnem(theMnemonic);
  };

 // ####   ####   ####   ####  

  getNamefromIdentity = (theIdentity) => {
    const client = new Dash.Client({
      network: this.state.whichNetwork,
    });

    const retrieveNameByRecord = async () => {
      // Retrieve by a name's identity ID
      return client.platform.names.resolveByRecord(
        "dashUniqueIdentityId",
        theIdentity // Your identity ID
      );
    };

    retrieveNameByRecord()
      .then((d) => {
        let nameRetrieved = d[0].toJSON();

        //console.log("Name retrieved:\n", nameRetrieved);

        //******************** */
        let lfObject = {
          identity: theIdentity,
          name: nameRetrieved.label,
        };

        LocalForage.setItem(this.state.walletId, lfObject)
          .then((d) => {
            //return LocalForage.getItem(walletId);
            //   console.log("Return from LF setitem:", d);
          })
          .catch((err) => {
            console.error(
              "Something went wrong setting to localForage:\n",
              err
            );
          });
        //******************** */
        lfObject = {
          walletId: this.state.walletId,
          identity: theIdentity,
          name: nameRetrieved.label,
        };

        LocalForage.setItem("mostRecentWalletId", lfObject)
          .then((d) => {
            //return LocalForage.getItem(walletId);
            //  console.log("Return from LF setitem:", d);
          })
          .catch((err) => {
            console.error(
              "Something went wrong setting to localForage:\n",
              err
            );
          });
        //******************** */
        this.setState({
          uniqueName: nameRetrieved.label,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        // console.log("There is no dashUniqueIdentityId to retrieve");
        this.setState({
          isLoading: false,
          uniqueName: "Name Error",
        });
      })
      .finally(() => client.disconnect());
  };

  getIdentityInfo = (theIdentity) => {
    console.log("Called get Identity Info");

    const client = new Dash.Client({ network: this.state.whichNetwork });

    const retrieveIdentity = async () => {
      return client.platform.identities.get(theIdentity); // Your identity ID
    };

    retrieveIdentity()
      .then((d) => {
        // console.log("Identity retrieved:\n", d.toJSON());

        this.setState({
          identityInfo: d.toJSON(),
          identityRaw: d,
          //isLoading: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);

        // this.setState({
        //   isLoading: false,
        // });
      })
      .finally(() => client.disconnect());
  };

  getWalletwithMnem = (theMnemonic) => {
    const client = new Dash.Client({
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: theMnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight:
            this.state.skipSynchronizationBeforeHeight,
        },
      },
    });

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();
      //console.log(account);
      //console.log(account.getTotalBalance());
      // console.log(account.getUnusedAddress().address);
      //console.log('TX History: ', account.getTransactionHistory());

      this.setState({
        //accountWallet: client, //Can I use this for the send TX?-> NO
        accountBalance: account.getTotalBalance(),
        //accountAddress: account.getUnusedAddress().address, //This can be used if you havent created the DGMDocument <-
        //accountHistory: account.getTransactionHistory(),
      });

      return true;
    };

    retrieveIdentityIds()
      .then((d) => {
        console.log("Wallet Loaded:\n", d);
        this.setState({
          isLoadingWallet: false,
        });
        //This if - handles if there is an identity or not
        // if (d.length === 0) {
        //   this.setState({
        //     isLoading: false,
        //     identity: "No Identity",
        //   });
        // } else {
        //   this.setState(
        //     {
        //       identity: d[0],
        //       isLoading: false,
        //       //maintain Loading bc continuing to other functions
        //     }
        //   );
        // }
      })
      .catch((e) => {
        console.error("Something went wrong getting Wallet:\n", e);
        this.setState({
          isLoadingWallet: false,
          isLoading: false,
        });
      })
      .finally(() => client.disconnect());
  };

  // ####   ####   ####   ####   ####   ####   #####

  //PUT THE QUERY SEARCHES HERE
  startSearch = (identityToSearch) =>{ //Called from name doc pulled -> 
    this.getSearchReviews(identityToSearch);
  }

  searchRace = () => {
    if (this.state.Search1 &&
      this.state.Search2) {
  this.setState({
    Search1: false,
    Search2: false,
    //DONT HAVE TO ADD STATE TO PUSH TO DISPLAY BECAUSE THE REVIEWS AND NAMES PUSHED TOGETHER AND THEN THREADS APPEAR <- SO DO I WANT TO QUERY NAME FIRST THEN?
    isLoadingSearch: false,
  });
}
  }

  getSearchReviews = (theIdentity) => {
    //console.log("Calling getSearchReviews");

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGRContract: {
          contractId: this.state.DataContractDGR,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get("DGRContract.dgrreview", {
        where: [
          ["toId", "==", theIdentity],
          ['$createdAt', '<=' , Date.now()]
    ],
    orderBy: [
    ['$createdAt', 'desc'],
  ],
      });
    };


    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no SearchReviews");

          this.setState(
            {
              Search1: true,
              Search2: true,
              SearchedReviews: [],
            },
            () => this.searchRace()
          );
        } else {

          let docArray = [];
          //console.log("Getting Search Reviews");

          for(const n of d) {
            let returnedDoc = n.toJSON()
             //console.log("Review:\n", returnedDoc);
             returnedDoc.toId = Identifier.from(returnedDoc.toId, 'base64').toJSON();
             //console.log("newReview:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }
          this.getSearchReviewNames(docArray);
          this.getSearchReplies(docArray); 
          
          
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  }; 

  getSearchReviewNames = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DPNS: {
          contractId: this.state.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    // Start of Setting Unique reviews
    let arrayOfReviews = arrayOfOwnerIds.map(id =>{
       return docArray.find(doc => id === doc.$ownerId)
    })
    // End of Setting Unique reviews

    arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    //console.log("Calling getNamesforDSOmsgs");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNS.domain", {
        where: [["records.dashUniqueIdentityId", "in", arrayOfOwnerIds]],
        orderBy: [["records.dashUniqueIdentityId", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            SearchedReviewNames: nameDocArray,
            SearchedReviews: arrayOfReviews, //This is a unique set of reviews only single review per reviewer
            Search1: true,
          },
          () => this.searchRace()
        );
      })
      .catch((e) => {
        console.error(
          "Something went wrong getting Search Names:\n",
          e
        );
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getSearchReplies = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGRContract: {
          contractId: this.state.DataContractDGR,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    // This Below is to get unique set of ByYou review doc ids
    let arrayOfReviewIds = docArray.map((doc) => {
      return doc.$id;
    });

    //console.log("Array of ByYouThreads ids", arrayOfReviewIds);

    let setOfReviewIds = [...new Set(arrayOfReviewIds)];

    arrayOfReviewIds = [...setOfReviewIds];

    //console.log("Array of order ids", arrayOfReviewIds);

    const getDocuments = async () => {
      //console.log("Called Get Search Replies");

      return client.platform.documents.get("DGRContract.dgrreply", {
        where: [["reviewId", "in", arrayOfReviewIds]], // check reviewId ->
        orderBy: [["reviewId", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for(const n of d) {
          let returnedDoc = n.toJSON()
           //console.log("Thr:\n", returnedDoc);
           returnedDoc.reviewId = Identifier.from(returnedDoc.reviewId, 'base64').toJSON();
           //console.log("newThr:\n", returnedDoc);
          docArray = [...docArray, returnedDoc];
        }

          this.setState(
            {
              Search2: true,
              SearchedReplies: docArray
            },
            () => this.searchRace()
          );
        
      })
      .catch((e) => {
        console.error("Something went wrong Search Replies:\n", e);
        
      })
      .finally(() => client.disconnect());
  };

  //getSearchReviewThreadNames -> There is not name retrieval because only owner can replay. 
  
  //Need to filter to ensure. -> 

  //pUT THE YOUR STUFF HERE -> HOW IS IT DIFFERENT the identity is your identity and actually like Search replies I should filter out ones that don't belong to the person of the review


  yourReviewsRace = () => {
    if (this.state.YourReviews1 &&
      this.state.YourReviews2) {
  this.setState({
    YourReviews1: false,
    YourReviews2: false,
    
    isLoadingYourReviews: false,
  });
}
  }

  getYourReviews = (theIdentity) => {
    //console.log("Calling getYourReviews");

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGRContract: {
          contractId: this.state.DataContractDGR,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get("DGRContract.dgrreview", {
        where: [
          ["toId", "==", theIdentity],
          ['$createdAt', '<=' , Date.now()]
    ],
    orderBy: [
    ['$createdAt', 'desc'],
  ],
      });
    };


    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no YourReviews");

          this.setState(
            {
              YourReviews1: true,
              YourReviews2: true,
            },
            () => this.yourReviewsRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting YourReviews Reviews");

          for(const n of d) {
            let returnedDoc = n.toJSON()
             //console.log("Review:\n", returnedDoc);
             returnedDoc.toId = Identifier.from(returnedDoc.toId, 'base64').toJSON();
             //console.log("newReview:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }
          this.getYourReviewNames(docArray);
          this.getYourReplies(docArray); 
          
          
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  }; 

  getYourReviewNames = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DPNS: {
          contractId: this.state.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    //console.log("Calling getNamesforDSOmsgs");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNS.domain", {
        where: [["records.dashUniqueIdentityId", "in", arrayOfOwnerIds]],
        orderBy: [["records.dashUniqueIdentityId", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            YourReviewNames: nameDocArray,
            YourReviews: docArray,
            YourReviews1: true,
            
          },
          () => this.yourReviewsRace()
        );
      })
      .catch((e) => {
        console.error(
          "Something went wrong getting YourReview Names:\n",
          e
        );
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getYourReplies = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGRContract: {
          contractId: this.state.DataContractDGR,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    // This Below is to get unique set of ByYou review doc ids
    let arrayOfReviewIds = docArray.map((doc) => {
      return doc.$id;
    });

    //console.log("Array of ByYouThreads ids", arrayOfReviewIds);

    let setOfReviewIds = [...new Set(arrayOfReviewIds)];

    arrayOfReviewIds = [...setOfReviewIds];

    //console.log("Array of order ids", arrayOfReviewIds);

    const getDocuments = async () => {
      //console.log("Called Get Search Replies");

      return client.platform.documents.get("DGRContract.dgrreply", {
        where: [["reviewId", "in", arrayOfReviewIds]], // check reviewId ->
        orderBy: [["reviewId", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for(const n of d) {
          let returnedDoc = n.toJSON()
           //console.log("Thr:\n", returnedDoc);
           returnedDoc.reviewId = Identifier.from(returnedDoc.reviewId, 'base64').toJSON();
           //console.log("newThr:\n", returnedDoc);
          docArray = [...docArray, returnedDoc];
        }

          this.setState(
            {
              YourReviews2: true,
              YourReplies: docArray
            },
            () => this.yourReviewsRace()
          );
        
      })
      .catch((e) => {
        console.error("Something went wrong Search Replies:\n", e);
        
      })
      .finally(() => client.disconnect());
  };

  
  //$$  $$   $$$  $$  $  $$  $$$  $$$  $$  $$

 //handleYourReview = (reviewDoc) =>{

    //This will decide to create or edit => HANDLED IN THE EDITCREATEBUTTONCOMPONENT
    //1) search if there is already a reply to this review -> SAME AS REVIEW BUT DONE HERE -> THE FLOW DIFFERENCE BETWEEN REVIEWS AND REPLIES IS INTERESTING
    //2) if there is edit, if there is not create -> 
  //}

  handleYourReply = (reviewDoc, revieweeLabel) => {
    //First search and see if there is already a reply for the review
    let replyDoc = this.state.YourReplies.find((doc)=>{
      return doc.reviewId === reviewDoc.$id;
    }); 
    
    if(replyDoc !== undefined){
      
      this.setState({
        replyReview: reviewDoc,
        replyToEdit: replyDoc,
        replyingToName: revieweeLabel,
      },()=>this.showModal('EditReplyModal'));
      
    } else {

      this.setState({
        replyReview: reviewDoc,
        replyToEdit: [],
        replyingToName: revieweeLabel,
      },()=>this.showModal('CreateReplyModal'));

    }

  }
  
  
    

  createReview = (reviewObject) => {
    console.log("Called Create Review");

    this.setState({
      isLoadingSearch: true,
    });

    const clientOpts = {
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: this.state.mnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight:
            this.state.skipSynchronizationBeforeHeight,
        },
      },
      apps: {
        DGRContract: {
          contractId: this.state.DataContractDGR,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const submitReviewDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      }

      const reviewProperties = {
        toId: this.state.SearchedNameDoc.$ownerId,
        review: reviewObject.review,
        rating: reviewObject.rating,
        
      };
      //console.log('Review to Create: ', reviewProperties);

      // Create the note document
      const dgrDocument = await platform.documents.create(
        "DGRContract.dgrreview",
        identity,
        reviewProperties
      );

      //############################################################
      //This below disconnects the document sending..***

      // return dgrDocument;

      //This is to disconnect the Document Creation***
      //############################################################

      const documentBatch = {
        create: [dgrDocument], // Document(s) to create
      };

      await platform.documents.broadcast(documentBatch, identity);
      return dgrDocument;
    };

    submitReviewDoc()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Document:\n", returnedDoc);

        let review = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,

          review: reviewObject.review,
        rating: reviewObject.rating,

        $createdAt: returnedDoc.$createdAt
        };

        this.setState({
          SearchedReviews: [review, ...this.state.SearchedReviews],
          isLoadingSearch: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong with review creation:\n", e);
        
      })
      .finally(() => client.disconnect());

      //THIS BELOW IS THE NAME DOC ADD, SO PROCESSES DURING DOC SUBMISSION ***
    let nameDoc = {
      $ownerId: this.state.identity,
      label: this.state.uniqueName,
    };

    this.setState({
      SearchedReviewNames: [nameDoc, ...this.state.SearchedReviewNames]
    });
    //END OF NAME DOC ADD***
  };


  editReview = (reviewObject) => {
    console.log("Called Edit Review");

    this.setState({
      isLoadingSearch: true,
    });

    const clientOpts = {
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: this.state.mnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight:
            this.state.skipSynchronizationBeforeHeight,
        },
      },
      apps: {
        DGRContract: {
          contractId: this.state.DataContractDGR,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const submitReviewDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      }

      const [document] = await client.platform.documents.get(
        "DGRContract.dgrreview",
        {
          where: [
            [
              "$id",
              "==",
              this.state.reviewToEdit.$id,
            ],
          ],
        }
      );

      

      if (
        this.state.reviewToEdit.review !==
        reviewObject.review
      ) {
        document.set("review", reviewObject.review);
      }

      if (
        this.state.reviewToEdit.rating !==
        reviewObject.rating
      ) {
        document.set("review", reviewObject.rating);
      }

      await platform.documents.broadcast({ replace: [document] }, identity);
      return document;
     

      //############################################################
      //This below disconnects the document editing..***

       //return document;

      //This is to disconnect the Document editing***
      //############################################################

      
    };

    submitReviewDoc()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Edited Review Doc:\n", returnedDoc);

        let review = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,

          review: reviewObject.review,
          rating: reviewObject.rating,

          $createdAt: returnedDoc.$createdAt
        };

        let editedReviews = this.state.SearchedReviews;

        editedReviews.splice(this.state.reviewToEditIndex, 1, review);

        this.setState({
          SearchedReviews: editedReviews,
          isLoadingSearch: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong with review edit:\n", e);
      })
      .finally(() => client.disconnect());

   };

 createReply = (replyObject) => {
  console.log("Called Create Reply");

  this.setState({
    isLoadingYourReviews: true,
  });

  const clientOpts = {
    network: this.state.whichNetwork,
    wallet: {
      mnemonic: this.state.mnemonic,
      adapter: LocalForage.createInstance,
      unsafeOptions: {
        skipSynchronizationBeforeHeight:
          this.state.skipSynchronizationBeforeHeight,
      },
    },
    apps: {
      DGRContract: {
        contractId: this.state.DataContractDGR,
      },
    },
  };
  const client = new Dash.Client(clientOpts);

  const submitReviewDoc = async () => {
    const { platform } = client;

    let identity = "";
    if (this.state.identityRaw !== "") {
      identity = this.state.identityRaw;
    } else {
      identity = await platform.identities.get(this.state.identity);
    }

    const replyProperties = {
      reviewId: this.state.replyReview.$id,
      reply: replyObject.reply,
      
    };
    //console.log('Reply to Create: ', replyProperties);

    // Create the note document
    const dgrDocument = await platform.documents.create(
      "DGRContract.dgrreply",
      identity,
      replyProperties
    );

    //############################################################
    //This below disconnects the document sending..***

    // return dgrDocument;

    //This is to disconnect the Document Creation***
    //############################################################

    const documentBatch = {
      create: [dgrDocument], // Document(s) to create
    };

    await platform.documents.broadcast(documentBatch, identity);
    return dgrDocument;
  };

  submitReviewDoc()
    .then((d) => {
      let returnedDoc = d.toJSON();
      console.log("Document:\n", returnedDoc);

      let reply = {
        $ownerId: returnedDoc.$ownerId,
        $id: returnedDoc.$id,
        $createdAt: returnedDoc.$createdAt,

        reviewId: this.state.replyReview.$id,
        reply: replyObject.reply,
      
      };

      this.setState({
        YourReplies: [reply, ...this.state.YourReplies],
        isLoadingYourReviews: false,
      });
    })
    .catch((e) => {
      console.error("Something went wrong with reply creation:\n", e);
      
    })
    .finally(() => client.disconnect());

 }


 editReply = (replyObject) => {
  console.log("Called Edit Reply");

  this.setState({
    isLoadingYourReviews: true,
  });

  const clientOpts = {
    network: this.state.whichNetwork,
    wallet: {
      mnemonic: this.state.mnemonic,
      adapter: LocalForage.createInstance,
      unsafeOptions: {
        skipSynchronizationBeforeHeight:
          this.state.skipSynchronizationBeforeHeight,
      },
    },
    apps: {
      DGRContract: {
        contractId: this.state.DataContractDGR,
      },
    },
  };
  const client = new Dash.Client(clientOpts);

  const submitReplyDoc = async () => {
    const { platform } = client;

    let identity = "";
    if (this.state.identityRaw !== "") {
      identity = this.state.identityRaw;
    } else {
      identity = await platform.identities.get(this.state.identity);
    }

    const [document] = await client.platform.documents.get(
      "DGRContract.dgrreply",
      {
        where: [
          [
            "$id",
            "==",
            this.state.replyToEdit.$id,
          ],
        ],
      }
    );

    if (
      this.state.replyToEdit.reply !==
      replyObject.reply
    ) {
      document.set("reply", replyObject.reply);
    }

    await platform.documents.broadcast({ replace: [document] }, identity);
    return document;
   

    //############################################################
    //This below disconnects the document editing..***

     //return document;

    //This is to disconnect the Document editing***
    //############################################################
  };

  submitReplyDoc()
    .then((d) => {
      let returnedDoc = d.toJSON();
      console.log("Edited Reply Doc:\n", returnedDoc);

      let editedReply = {
        $ownerId: returnedDoc.$ownerId,
        $id: returnedDoc.$id,
        $createdAt: returnedDoc.$createdAt,

        reviewId: this.state.replyReview.$id,
        reply: replyObject.reply,
      
      };

      
      let indexOfReply = this.state.YourReplies.findIndex(reply => {
        return reply.$id === editedReply.$id;
      });

        let editedReplies = this.state.YourReplies;

        editedReplies.splice(indexOfReply, 1, editedReply);

        this.setState({
          YourReplies: editedReplies,
          isLoadingYourReviews: false,
        });
       

    })
    .catch((e) => {
      console.error("Something went wrong with reply creation:\n", e);
      
    })
    .finally(() => client.disconnect());

 }

  doTopUpIdentity = (numOfCredits) => {
    this.setState({
      isLoadingWallet: true,
    });
    const clientOpts = {
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: this.state.mnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight:
            this.state.skipSynchronizationBeforeHeight,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const topupIdentity = async () => {
      const identityId = this.state.identity; // Your identity ID
      const topUpAmount = numOfCredits; // Number of duffs ie 1000

      await client.platform.identities.topUp(identityId, topUpAmount);
      return client.platform.identities.get(identityId);
    };

    topupIdentity()
      .then((d) => {
        console.log("Identity credit balance: ", d.balance);
        this.setState({
          identityInfo: d.toJSON(),
          identityRaw: d,
          isLoadingWallet: false,
          accountBalance: this.state.accountBalance - 1000000,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingWallet: false,
          topUpError: true, //Add to State and handle ->
        });
      })
      .finally(() => client.disconnect());
  };

  //#######################################################################

  render() {
    this.state.mode === "primary"
      ? (document.body.style.backgroundColor = "rgb(280,280,280)")
      : (document.body.style.backgroundColor = "rgb(20,20,20)");

    this.state.mode === "primary"
      ? (document.body.style.color = "black")
      : (document.body.style.color = "white");

    return (
      <>
        <TopNav
          handleMode={this.handleMode}
          mode={this.state.mode}
          showModal={this.showModal}

          whichNetwork={this.state.whichNetwork}
          isLoggedIn={this.state.isLoggedIn}
          toggleTopNav={this.toggleTopNav}
          expandedTopNav={this.state.expandedTopNav}
        />
        <Image fluid="true" id="dash-bkgd" src={DashBkgd} alt="Dash Logo" />

        <Container className="g-0">
  <Row className="justify-content-md-center">
    <Col md={9} lg={8} xl={7} xxl={6}>
        

        {this.state.isLoggedIn ? (
          <>
            <TabsOnPage
              whichTab={this.state.whichTab}
              handleTab={this.handleTab}
            />

        

            <div className="bodytext">

              {this.state.whichTab === "Search" ? (
                <>
                <LowCreditsOnPage 
      identityInfo={this.state.identityInfo}
      uniqueName={this.state.uniqueName}
      showModal={this.showModal}
       />

                  <h3><b>Get Reviews for</b></h3>

                  <NameSearchForm
                  mode={this.state.mode}
                  nameToSearch={this.state.nameToSearch}
                  
                  nameFormat={this.state.nameFormat}
                  SearchedNameDoc={this.state.SearchedNameDoc}

                  searchName={this.searchName}
                  //tooLongNameError={this.state.tooLongNameError}
                  
                  handleOnChangeValidation={this.handleOnChangeValidation}
                  />


                  {/* <div
                    className="BottomBorder"
                    style={{ paddingTop: ".5rem" }}
                  ></div> */}
                  

         

<RatingSummary
            SearchedReviews={this.state.SearchedReviews}
            SearchedNameDoc={this.state.SearchedNameDoc}
            isLoadingSearch={this.state.isLoadingSearch}

            />

            

  {/* //Make the reviewSummary remove as well when No NameDoc? ^^^^ ->  */}

<AddOrEditReviewButton
SearchedReviews={this.state.SearchedReviews}
SearchedNameDoc={this.state.SearchedNameDoc}
identity={this.state.identity}
showModal={this.showModal}
handleEditReview={this.handleEditReview}
isLoadingSearch={this.state.isLoadingSearch}

/>



{this.state.isLoadingSearch ? (
          <>
            <p></p>
            <div id="spinner">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
            <p></p>
          </>
        ) : (
          <></>
        )}

            <Reviews 
            mode={this.state.mode}

            SearchedReviews={this.state.SearchedReviews}
            SearchedReviewNames={this.state.SearchedReviewNames}
            SearchedReplies={this.state.SearchedReplies}

            SearchedNameDoc={this.state.SearchedNameDoc}


              />

              {this.state.SearchedReviews.length === 0 && !this.state.isLoadingSearch ? 
              <div className="bodytext">
              <p>Sorry, there are no reviews available.</p>
              </div>
              :<></>}

                  
                </>
              ) : (
                <>
                
                  {/* THIS IS WHERE THE "YOUR Reviews" WILL GO */}

          {/* <div className="BottomBorder" style={{ paddingTop: "1rem" }}></div>
            <p></p> */}

            <CreditsOnPage
            identityInfo={this.state.identityInfo}
            uniqueName={this.state.uniqueName}
            showModal={this.showModal}
            />
        
                  <YourReviews

                    YourReviews={this.state.YourReviews}
                    YourReviewNames={this.state.YourReviewNames}
                    YourReplies={this.state.YourReplies}

                    identity={this.state.identity}
                    uniqueName={this.state.uniqueName}
 
                    handleYourReply={this.handleYourReply}

                    mode={this.state.mode}

                    isLoadingYourReviews={this.state.isLoadingYourReviews}
                  />


                </>
              )}
            </div>
            
          </>
        ) : (
          <div className="bodytextnotop">
            <div className="bodytext" style={{ textAlign: "center" }}>
              <h3>Reviews to help build trust and grow the Dash economy!</h3>
            </div>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => this.showModal("ConnectWalletModal")}
              >
                <b>Connect Wallet</b>
              </Button>
            </div>

            <div className="BottomBorder" style={{ paddingTop: "1rem" }}></div>
            <p></p>
          <h3><b>Get Reviews for</b></h3>
        
            <NameSearchForm

             mode={this.state.mode}
             nameToSearch={this.state.nameToSearch}

             SearchedNameDoc={this.state.SearchedNameDoc}
             nameFormat={this.state.nameFormat}

             searchName={this.searchName}
            //tooLongNameError={this.state.tooLongNameError}
             
             handleOnChangeValidation={this.handleOnChangeValidation}
            />

{/* <div
                    className="BottomBorder"
                    style={{ paddingTop: "1rem", paddingBottom: '.5rem' }}
                  ></div> */}


            <RatingSummary
            SearchedReviews={this.state.SearchedReviews}
            SearchedNameDoc={this.state.SearchedNameDoc}
            isLoadingSearch={this.state.isLoadingSearch}

            />
          

{this.state.isLoadingSearch ? (
          <>
            <p></p>
            <div id="spinner">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
            <p></p>
          </>
        ) : (
          <></>
        )}

{!this.state.isLoadingSearch ? (
          <>
             <Reviews 
            mode={this.state.mode}

            SearchedReviews={this.state.SearchedReviews}
            SearchedReviewNames={this.state.SearchedReviewNames}
            SearchedReplies={this.state.SearchedReplies}

            SearchedNameDoc={this.state.SearchedNameDoc}

              />
          </>
        ) : (
          <></>
        )}

           

              {this.state.SearchedReviews.length === 0 && !this.state.isLoadingSearch ? 
              <div className="bodytext">
              <p>Sorry, there are no reviews available.</p>
              </div>
            :
            <></>}

          
          </div>
        )}

        <div className="bodytext">
          <Footer />
        </div>

        </Col>
        </Row>
        </Container>


        {/* #####    BELOW ARE THE MODALS    #####    */}

        {this.state.isModalShowing &&
        this.state.presentModal === "ConnectWalletModal" ? (
          <ConnectWalletModal
            isModalShowing={this.state.isModalShowing}
            handleWalletConnection={this.handleWalletConnection}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "LogoutModal" ? (
          <LogoutModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            handleLogout={this.handleLogout}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "TopUpIdentityModal" ? (
          <TopUpIdentityModal
            accountBalance={this.state.accountBalance}
            isLoadingWallet={this.state.isLoadingWallet}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            doTopUpIdentity={this.doTopUpIdentity}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

         {this.state.isModalShowing &&
        this.state.presentModal === "CreateReviewModal" ? (
          <CreateReviewModal
            isModalShowing={this.state.isModalShowing}
            createReview={this.createReview}
            SearchedNameDoc={this.state.SearchedNameDoc}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "EditReviewModal" ? (
          <EditReviewModal

          reviewToEdit={this.state.reviewToEdit}
          SearchedNameDoc={this.state.SearchedNameDoc}

            editReview={this.editReview}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

{this.state.isModalShowing &&
        this.state.presentModal === "CreateReplyModal" ? (
          <CreateReplyModal

          replyReview={this.state.replyReview}
          replyingToName={this.state.replyingToName}

            createReply={this.createReply}

            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
        
        {this.state.isModalShowing &&
        this.state.presentModal === "EditReplyModal" ? (
          <EditReplyModal
          replyReview={this.state.replyReview}
        replyToEdit={this.state.replyToEdit}
        replyingToName={this.state.replyingToName}

            editReply={this.editReply}

            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
        
      </>
    );
  }
}

export default App;
