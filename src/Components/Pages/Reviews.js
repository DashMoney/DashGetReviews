import React from 'react';

import Review from './Review';

class Reviews extends React.Component {
  
  render() { 

    let d = Date.now();


    let reviews = this.props.SearchedReviews.map(
      (review, index) => {  
        //console.log(post);
        return (
          <Review
          key={index}
          mode={this.props.mode} 
          index={index} 

          review = {review}
          date = {d}

          identity={this.props.identity} //For if my review so can edit
          //uniqueName={this.props.uniqueName}

          
          handleSearchedReview={this.props.handleSearchedReview} //to edit my reviews

          SearchedNameDoc={this.props.SearchedNameDoc}

          SearchedReviewNames={this.props.SearchedReviewNames}
          SearchedReplies={this.props.SearchedReplies}
        
          />
          
        )
      }
    );

    return (
      <>
      {reviews}
      </>
    );
  }
}
 
export default Reviews;
