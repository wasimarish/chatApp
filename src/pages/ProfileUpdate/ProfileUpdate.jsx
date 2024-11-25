import { onAuthStateChanged } from 'firebase/auth';
import assets from '../../assets/assets';
import './ProfileUpdate.css';
import { useEffect, useState } from 'react';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';
import { useContext } from 'react';

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const { setUserData } = useContext(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Upload profile picture");
        return;
      }
      const docRef = doc(db, 'users', uid);
      if (image) {
        const imgUrl = await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef, {
          avatar: imgUrl,
          bio: bio,
          name: name,
        });
      } else {
        await updateDoc(docRef, {
          bio: bio,
          name: name,
        });
      }
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      console.log("Profile updated:", snap.data());
      if (snap.data().avatar && snap.data().name) {
        navigate('/chat');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Loaded user data:", data);
          if (data.name) {
            setName(data.name);
          }
          if (data.bio) {
            setBio(data.bio);
          }
          if (data.avatar) {
            setPrevImage(data.avatar);
          }
        }
      } else {
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpeg, .jpg' hidden />
            <img src={image ? URL.createObjectURL(image) : prevImage || assets.avatar_icon} alt="" />
            Upload Profile Image
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='your name' required />
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder='Write Profile bio' required></textarea>
          <button type='submit'>Save</button>
        </form>
        <img className='profile-pic' src={image ? URL.createObjectURL(image) : prevImage || prevImage? prevImage :assets.logo_icon} alt="" />
      </div>
    </div>
  );
}

export default ProfileUpdate;














































