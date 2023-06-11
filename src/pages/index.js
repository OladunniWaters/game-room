import Head from "next/head";
import Style from "../styles/Home.module.css";
import Image from "next/image";
import { GraphQLClient, gql } from "graphql-request";
import Link from "next/link";
import { SEO } from "../Components/SEO/index";

const url = `${process.env.ENDPOINT}`;

  // instantiating a graphql client...
const graphConnect = new GraphQLClient(url);

const query = gql`
query {
  posts {
    id
   title,
    datePublished,
    slug,
    content {
       html
    }
    author {
     name,
     avatar{
      url
     }
    }
    coverPhoto {
      url
    }
  }
}
`;

export async function getServerSideProps() {

  // making request to hygraph for posts
  const { posts } = await graphConnect.request(query);

  return { props: { posts } };
}

function Homepage({ posts }) {
  return (
    <>
        <SEO
          title="Welcome to GameRoom"
          description="Gaming room blog."
        />

      <main className={Style.postcontainer}>
  {/* using array.map() method to iterate each post returned from hygraph */}
        {posts.map((post) => {
          return (
            <div  key={post.id}>
              <div className={Style.inside}>
                <div className={Style.img}>
                  <Image
                    src={post.coverPhoto.url}
                    alt="featured text"
                    fill
                  />
                </div>
                <div className={Style.container}>
                  <Link href={post.slug}>
                    <h2>{post.title}</h2>
                  </Link>
                  <div>
                      <p>{post.author.name}</p>
                       <p>{post.datePublished}</p>
                  </div>
                 
                  <Link href={post.slug}>
                    <button className={Style.readButton}>Read More</button>{" "}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </main>

   
    </>
  );
}

export default Homepage;
