import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// UI component for main post content
export default function PostContent({ post }) {
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{' '}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{' '}
        on {createdAt.toISOString()}
      </span>
      
      <ReactMarkdown>{post?.content}</ReactMarkdown>

      <div style={{display:"flex",flexDirection:'column',justifyContent: "space-evenly",alignItems:'center'}}>
        <h2>Investors</h2>
      <div style={{display:"flex",flexDirection:'row',justifyContent: "space-evenly",marginBottom:20}}>
        <div style={{display:"flex",flexDirection:'column',alignItems:'center',paddingRight:20}}>
        <h4>Existing</h4>
        <table>
          <thead>
          <tr>
            <th>
              Name
            </th>
            <th>
              Number
            </th>
            <th>
              Amount
            </th>
          </tr>
          </thead>
          <tbody>
            {post.existing.map((potentials)=>(
            <tr>
              <td>{potentials.name}</td>
              <td>{potentials.contactNumber}</td>
              <td>{potentials.amount}</td>
            </tr>
            ))}
            
          </tbody>
        </table>
        </div>

        <div style={{display:"flex",flexDirection:'column',alignItems:'center'}}>
        <h4>Potential</h4>
        <table ><thead>
          <tr>
            <th>
              Name
            </th>
            <th>
              Number
            </th>
            <th>
              Amount
            </th>
            
          </tr>
          </thead>
          <tbody>
            {post.potential.map((potentials)=>(
            <tr>
              <td>{potentials.name}</td>
              <td>{potentials.contactNumber}</td>
              <td>{potentials.amount}</td>
                           
            </tr>
            ))}
            
          </tbody></table>
          </div>
        </div>
</div>


    </div>
  );
}
