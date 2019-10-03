
import React from 'react'
import { Comment } from '../models/Comment';
import { Layout } from '../layout';
import Editor from '../components/comments/components/Editor';
import { SubmitButton, Button } from '../components/shared/button';
import Header from '../components/shared/header/components/Header';
import { BackNavigation } from '../components/shared/header';
import { DateUtil } from '../utils/DateUtil';
import PostCommentAuthorAndText from '../components/posts/post/components/PostCommentAuthorAndText';
import { CommentUtil } from '../utils/CommentUtil';
import PostComment from '../components/posts/post/components/PostComment';

interface CommentState {
  comment: Comment | {};
  newCommentText: string;
  isGettingComment: boolean;
  isGettingCommentSuccess: boolean;
  isGettingCommentFailure: boolean;
}

const comment: Comment = {
  commentId: '0',
  text: "Yeah yo, that's pretty cool and all but uhhh",
  postAuthor: "elonmusk",
  createdAt: DateUtil.createPreviousDate(0, 0, 10),
  childComments: [{
    commentId: '2',
    text: `Whoa, Elon Musk is on here?.
    `,
    parentCommentId: '0',
    postAuthor: "dondraper",
    createdAt: DateUtil.createPreviousDate(0, 0, 10),
    childComments: [],
    postSlug: '/discuss/where-to-do-ddd',
  },
  {
    commentId: '3',
    text: `Whoa, Don Draper is on here?.
    `,
    parentCommentId: '2',
    postAuthor: "tonysoprano",
    createdAt: DateUtil.createPreviousDate(0, 0, 10),
    childComments: [],
    postSlug: '/discuss/where-to-do-ddd',
  }],
  postSlug: '/where-to-do-ddd',
}

class CommentPage extends React.Component<any, CommentState> {
  private maxCommentLength: number = 9000;
  private minCommentLength: number = 10;

  constructor (props: any) {
    super(props);

    this.state = {
      comment: {},
      newCommentText: '',
      isGettingComment: false,
      isGettingCommentSuccess: false,
      isGettingCommentFailure: false,
    }
  }

  getRawTextLength (tags: string) {
    return tags.replace(/<[^>]*>?/gm, '').length;
  }

  isFormReady () {
    const { newCommentText } = this.state;
    const commentTextLength = this.getRawTextLength(newCommentText);
    const commentIsOK = !!newCommentText === true 
      && commentTextLength < this.maxCommentLength
      && commentTextLength > this.minCommentLength;

    return commentIsOK;
  }

  updateValue (name: any, value: any) {
    this.setState({
      ...this.state,
      [name]: value
    })
  }

  updateFetchState (
    isGettingComment: boolean,
    isGettingCommentSuccess: boolean,
    isGettingCommentFailure: boolean, cb?: Function): void {

      this.setState({
        ...this.state,
        isGettingComment,
        isGettingCommentSuccess,
        isGettingCommentFailure
      }, () => cb ? cb() : '')
  }

  async getCommentFromAPI () {
    this.setState({
      ...this.state,
      comment: comment
    })
  }

  componentDidMount () {
    this.getCommentFromAPI();
  }

  async submitComment () {

  }

  getCommentUnderFocus () {
    return this.state.comment;
  }

  onClickJoinButton () {

  }

  isCommentFetched () {
    return Object.keys(this.state.comment).length !== 0;
  }

  render () {
    const commentUnderFocus = this.state.comment as Comment;
    const comments = this.isCommentFetched() ? CommentUtil.getThread(commentUnderFocus.childComments) : [];
    console.log(comments);
    return (
      <Layout>
        <div className="flex flex-row flex-center flex-even">
          <Header title={``} />
          <BackNavigation
            to={`/discuss${commentUnderFocus.postSlug}`}
            text={`Back to "${"Where the hell do I even start with Domain-Driven Design"}"`}
          />
          <Button 
            text="Join" 
            onClick={() => this.onClickJoinButton()}
          />
        </div>
        <br/>
        <PostCommentAuthorAndText {...commentUnderFocus}/>
        
        <br/>
        <br/>
        <Editor
          text={this.state.newCommentText}
          maxLength={this.maxCommentLength}
          placeholder="Post your reply"
          handleChange={(v: any) => this.updateValue('newCommentText', v)}
        />
        <SubmitButton
          text="Submit"
          onClick={() => this.submitComment()}
        />
        <br/>
        <br/>

        {comments.map((c, i) => (
          <PostComment key={i} {...c}/>
        ))}


      </Layout>
    )
  }
}

export default CommentPage;
