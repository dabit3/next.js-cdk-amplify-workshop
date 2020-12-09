import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import '../../configureAmplify'
import ReactMarkdown from 'react-markdown'
import { listPosts, getPostById } from '../../graphql'

export default function Post({ post }) {
  console.log('post: ', post)
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <h1>{post.title}</h1>
      <div style={markdownStyle}>
        <ReactMarkdown children={post.content} />
      </div>
      <p>Created by: {post.owner}</p>
    </div>
  )
}

export async function getStaticPaths() {
  const postData = await API.graphql({ query: listPosts })
  const paths = postData.data.listPosts.map(post => ({ params: { id: post.id }}))
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps ({ params }) {
  const { id } = params
  const postData = await API.graphql({
    query: getPostById, variables: { postId: id }
  })
  return {
    props: {
      post: postData.data.getPostById
    },
    revalidate: 100
  }
}

const markdownStyle = { padding: 20, border: '1px solid #ddd', borderRadius: 5 }