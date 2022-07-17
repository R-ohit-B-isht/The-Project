import styles from '@styles/Admin.module.css';
import AuthCheck from '@components/AuthCheck';
import { firestore, auth, serverTimestamp } from '@lib/firebase';
import ImageUploader from '@components/ImageUploader';
import firebase from "firebase/app";
import { useState ,useRef,useEffect} from 'react';
import { useRouter } from 'next/router';

import { useDocumentDataOnce,useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug);
  const [post] = useDocumentData(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
            <DeletePostButton postRef={postRef} />
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {

  const { register, errors, handleSubmit, formState, reset, watch } = useForm({ defaultValues, mode: 'onChange' });
  
  const { isValid, isDirty } = formState;

  const [existingIns,setExisting]=useState(defaultValues.existing);
  const [potentialIns,setPotential]=useState(defaultValues.potential);

  const [inserter,setInserter]=useState(
  {
      

      potential:[{
        amount:0,
        contactNumber:"",
        name:""}]
    }
  );
  const ref1 = useRef(null);
  const ref2= useRef(null);
  const ref3 = useRef(null);

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Post updated successfully!');
  };

  useEffect(()=>{
   setPotential(defaultValues.potential);
   setExisting(defaultValues.existing);
   });

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <div style={{display:"flex",flexDirection:'row',justifyContent: "space-evenly",marginBottom:20,}}>
        <div style={{display:"flex",flexDirection:'column',alignItems:'center',}}>
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
            {existingIns.map((potentials)=>(
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
            <th>
              move
            </th>
            <th>
              Remove
            </th>
          </tr>
          </thead>
          <tbody>
            {potentialIns.map((potentials)=>(
            <tr>
              <td>{potentials.name}</td>
              <td>{potentials.contactNumber}</td>
              <td>{potentials.amount}</td>
              <td><button className='none' name="investors" ref={register}  onClick={async()=>{
                //console.log(potentialIns)
               
var f= {name:potentials.name,
  amount:potentials.contactNumber,
 contactNumber:potentials.amount,};
var g=potentialIns;
 function getByValue(potentialIns, f){
                  for (let [key, value] of potentialIns.entries()) {

                    if (value.name === f.name)
                      return key;
                  }
                }
                var index=getByValue(potentialIns,f)
                if (index > -1) { // only splice array when item is found
                  g.splice(index, 1);
                  
                  await postRef.update({
                    potential:g
                 });
                }
                console.log(index);
                await postRef.update({
                  
                  existing:firebase.firestore.FieldValue.arrayUnion(
                      {name:potentials.name,
                    amount:potentials.contactNumber,
                   contactNumber:potentials.amount,}
                   )
                });
              }}>👈🏻 </button></td>

               <td><button className='none' name="deletors" ref={register}  onClick={async()=>{
                //console.log(potentialIns)
               
var f= {name:potentials.name,
  amount:potentials.contactNumber,
 contactNumber:potentials.amount,};
var g=potentialIns;
 function getByValue(potentialIns, f){
                  for (let [key, value] of potentialIns.entries()) {

                    if (value.name === f.name)
                      return key;
                  }
                }
                var index=getByValue(potentialIns,f)
                if (index > -1) { // only splice array when item is found
                  g.splice(index, 1);
                  
                  await postRef.update({
                    potential:g
                 });
                }
                console.log(index);
                
              }}>❌ </button></td>
            </tr>
            ))}
            
          </tbody></table>
          </div>
        </div>
        
        <div style={{display:"flex",flexDirection:'column',marginBottom:20,alignItems:'center'}}>
        <h3>Insert</h3>
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
            <th>
              move
            </th>
          </tr>
          </thead>
          <tbody>
            
            <tr>
              <td>
              <textarea  name='inserter.potential.name'  
              style={{width:'100%',height:'100%'}}
          ref={ref1}
        ></textarea>

              </td>
              <td>  <textarea name ='inserter.potential.contactNumber'  style={{width:'100%',height:'100%'}}
          ref={ref2}
        ></textarea></td>
              <td>  <textarea name ='inserter.potential.amount'  style={{width:'100%',height:'100%'}}
          ref={ref3}
        ></textarea></td>
              <td><button
              className='none' 
              name ='inserter.potential'  ref={register} 
              onClick =  { async ()=>{
              
                await postRef.update({
                  
                  potential:firebase.firestore.FieldValue.arrayUnion(
                      {name:ref1.current.value,
                    amount:ref3.current.value,
                   contactNumber:ref2.current.value,}
                   )
                });
                

                setInserter(
                  {potential:[{name:ref1.current.value,
                 amount:ref3.current.value,
                contactNumber:ref2.current.value,}]});
                
              }

              }>☝🏻 </button></td>
            </tr>
            
          </tbody></table>
          </div>
        <textarea
          name="content"
          ref={register({
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required' },
          })}
        ></textarea>

        {errors.content && <p className="text-danger">{errors.content.message}</p>}

        <fieldset>
          <input className={styles.checkbox} name="published" type="checkbox" ref={register} />
          <label>Published</label>
        </fieldset>

        <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </form>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm('are you sure!');
    if (doIt) {
      await postRef.delete();
      router.push('/admin');
      toast('post annihilated ', { icon: '🗑️' });
    }
  };

  return (
    <button className="btn-red" onClick={deletePost}>
      Delete
    </button>
  );
}
