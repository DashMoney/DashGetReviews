import React from 'react';
//import Badge from 'react-bootstrap/Badge';
//import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";

import YourReply from './YourReply';

class YourReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
    };
  }

  handleNameClick = (nameLabel) => {
    navigator.clipboard.writeText(nameLabel);
    this.setState({
      copiedName: true,
    });
  };

  // handleName = (msgDoc) =>{
  //   if(msgDoc.$ownerId === this.props.identity){
  //   return <span style={{ color: "#008de4" }}>{this.props.uniqueName}</span>
  //   }

  //   //*** *** */
  //     let nameDoc = this.props.PostNames.find(doc => {
  //       return msgDoc.$ownerId === doc.$ownerId
  //     })

  //     if(nameDoc === undefined){
  //       return 'Not Found'
  //     }

  //     return <span style={{ color: "#008de4" }} onClick={() => this.handleNameClick(nameDoc.label)}>
  //       {nameDoc.label}
  //       </span>
    
  // }

  getRelativeTimeAgo(messageTime, timeNow){


    let timeDifference = timeNow - messageTime;
  
    if(timeDifference >= 84600000){
      let longFormDate = new Date();
       longFormDate.setTime(messageTime);
      return longFormDate.toLocaleDateString();
    }
    
    /*
    Calculate milliseconds in a year
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const year = day * 365;
    */
  
    if(timeDifference < 15000){
      return "Just now"
    }else if(timeDifference <44000){
      return "Few moments ago"
    }else if(timeDifference <90000){
      return "1 min ago"
    }else if(timeDifference <150000){
      return "2 min ago"
    }else if(timeDifference <210000){
      return "3 min ago"
    }else if(timeDifference <270000){
      return "4 min ago"
    }else if(timeDifference <330000){
      return "5 min ago"
    }else if(timeDifference <390000){
      return "6 min ago"
    }else if(timeDifference <450000){
      return "7 min ago"
    }else if(timeDifference <510000){
      return "8 min ago"  
    }else if(timeDifference <570000){
      return "9 min ago"  
    }else if(timeDifference <660000){
      return "10 min ago"
    }else if(timeDifference <840000){
      return "12 min ago"
    }else if(timeDifference <1020000){
      return "15 min ago"
    }else if(timeDifference <1140000){
      return "18 min ago"
    }else if(timeDifference <1380000){
      return "20 min ago"
    }else if(timeDifference <1650000){
      return "25 min ago"
    }else if(timeDifference <1950000){
      return "30 min ago"
    }else if(timeDifference <2250000){
      return "35 min ago"
    }else if(timeDifference <2550000){
      return "40 min ago"
    }else if(timeDifference <3000000){
      return "45 min ago"
    }else if(timeDifference <5400000){
      return "1 hr ago"
    }else if(timeDifference <9000000){
      return "2 hrs ago"
    }else if(timeDifference <12600000){
      return "3 hrs ago"
    }else if(timeDifference <18000000){
      return "5 hrs ago"
    }else if(timeDifference <43200000){
      return "Many hrs ago"
    }else if(timeDifference <84600000){
      return "About a day ago"
    }
  }

  handleRating = () => {
    
    if(this.props.yourreview.rating === 1){
      return <>⭐</>;
    } else if(this.props.yourreview.rating === 2){
      return <>⭐⭐</>;
    }else if(this.props.yourreview.rating === 3){
      return <>⭐⭐⭐</>;
    }else if(this.props.yourreview.rating === 4){
      return <>⭐⭐⭐⭐</>;
    }else if(this.props.yourreview.rating === 5){
      return <span>⭐⭐⭐⭐⭐</span>;
    }else{
      return <>Unavailable</>;
    } 
    
  }
  
  render() { 
    let cardBkg;
    let cardText;

    if (this.props.mode === "primary") {
      cardBkg = "white";
      cardText = "dark";

    } else {
      cardBkg = "dark";
      cardText = "white";
    }
 
     let nameToPass = ''; //this is the nameDoc and not the label

    //  if(this.props.review.$ownerId === this.props.identity){
    //     nameToPass = this.props.uniqueName;
    //   }else{
        nameToPass = this.props.YourReviewNames.find(doc => {
          return this.props.yourreview.$ownerId === doc.$ownerId
        })
      //}

      if(nameToPass === undefined){
        nameToPass = 'Not Found'
      }else{
        nameToPass = nameToPass.label;
      }

//NEW THING BELOW -> ADDING Replies TO Reviews
   
    let replyDoc = this.props.YourReplies.find((doc)=>{
      return doc.reviewId === this.props.yourreview.$id;
    }); //This ^^^ makes sure reply are for the intended review
    //only return one with find( for latest?) <- based on query return should be right


    let replyToDisplay = [];

    if(replyDoc !== undefined ){
      replyToDisplay.push(replyDoc);

      replyToDisplay = replyToDisplay.map((reply, index )=>{
        return(

          <YourReply
          key={index}
          mode={this.props.mode} 
          index={index} 
          reply = {reply}

          ReviewerName = {nameToPass} //Dont need this for the Reply
          YourNameDoc={this.props.YourNameDoc} //this is always the replier

          date = {this.props.date}
          
          />
        )
      });
    }

    return (
      <>
       <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
        
        <Card.Body onClick={()=>this.props.handleYourReply(this.props.yourreview, nameToPass)}>

          <Card.Title className="cardTitle">

          <span style={{ color: "#008de3" }} onClick={() => this.handleNameClick(nameToPass)}>
        {nameToPass}
        </span>


  <span>
    {this.state.copiedName?<span>✅</span>:<></>}
    </span>

           
            <span className="textsmaller">
              {this.getRelativeTimeAgo(this.props.yourreview.$createdAt, this.props.date)}
            </span>

          </Card.Title>

          <Card.Subtitle className="mb-2">{this.handleRating()}</Card.Subtitle>
          {/* ^^^ This will be where the stars go, may need functionto handle display */}

          <Card.Text
          //onClick={()=>this.props.handleSearchedPost(this.props.post, nameToPass)}
          //^^^ There wont be a click on function in DGR -> yes there is if its your reply so must be logged in.
          
          >

            {this.props.yourreview.review}
          </Card.Text>
          {replyToDisplay}
        </Card.Body>
      </Card>
      </>
    );
  }
}
 
export default YourReview;
