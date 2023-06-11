//import Style from "../styles/Home.module.css";
import { GraphQLClient, gql } from "graphql-request";

const url = `${process.env.ENDPOINT}`;

  // instantiating a graphql client...
const graphConnect = new GraphQLClient(url);

const query = gql`
query Post($slug: String!) {
  post(where: {slug: $slug}) {
    id,
    title,
    slug,
    datePublished,
    author{
      id,
      name,
      avatar{
        url
      }
    }
    content{
      html
    }
    coverPhoto{
      id,
      url
    }
  }
}
`;


const SLUGLIST = gql`
 {
   posts {
     slug
   }
 } 
`;

export async function getStaticPaths() {
  const {posts} = await graphConnect.request(SLUGLIST);
  return{
    paths: posts.map((post) => ({params: { slug: post.slug } })),
    fallback: false,
  };
}


export async function getStaticProps({params}) {
  const slug = params.slug;
  // making request to hygraph for posts
  const data = await graphConnect.request(query, {slug});
  const post = data.post
  return {
    props: {
    post, 
  }, 
   revalidate: 10, 
  };
}


export default function BlogPost({post}) {
  return (
      <main>
          <img src={post.coverPhoto.url}/>
          <div>
             <h6>{post.author.name}</h6>
             <p>{post.datePublished}</p>
          </div>
          <h2>{post.title}</h2>
          <div  dangerouslySetInnerHTML={{ __html: post.content.html }}>
          </div>
      </main>
    )
}