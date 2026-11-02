
(() => {
  const PROJECT_URL = "https://qvheedcbirbynoqpdjo.supabase.co";
  const PUBLISHABLE_KEY = "sb_publishable_46vc-dDq7L7dZCFa2JxasQ_zAAshGkA";
  const N = window.NitroOnline = window.NitroOnline || {};
  const $ = id => document.getElementById(id);
  const safe = v => String(v ?? '');
  let client = null, session = null, realtime = null;

  function status(msg, kind='') {
    const el=$('nitroAuthStatus'); if(!el)return;
    el.textContent=msg; el.className='nitro-auth-status '+kind;
  }
  function toast(msg) {
    if(typeof window.showToast==='function') window.showToast(msg);
    else console.log('[NitroArcade]',msg);
  }
  function usernameFor(user) {
    return user?.user_metadata?.username || user?.email?.split('@')[0] || 'Player';
  }
  async function ensureProfile(user, requestedName='') {
    if(!client || !user) return;
    const username=(requestedName || usernameFor(user)).trim().slice(0,24);
    try {
      await client.from('profiles').upsert({id:user.id,username},{onConflict:'id'});
    } catch(e) { console.warn('Profile sync:',e); }
  }
  function updateAccountUI() {
    const user=session?.user || null, btn=$('nitroAccountBtn');
    if(btn) btn.textContent=user ? '👤 '+usernameFor(user) : 'Log In';
    const signed=$('nitroSignedInPanel'), actions=$('nitroAuthActions'), signedActions=$('nitroSignedInActions');
    if(signed) signed.hidden=!user; if(actions) actions.hidden=!!user; if(signedActions) signedActions.hidden=!user;
    if(user) {
      $('nitroSignedInName').textContent=usernameFor(user);
      $('nitroSignedInEmail').textContent=user.email || '';
      status('Connected to NitroArcade Online.','ok');
    } else status('Log in or create an account to join the online arcade.');
    updateOnlineBadge();
  }
  function updateOnlineBadge() {
    const el=$('nitroOnlineBadge'); if(!el)return;
    el.textContent=session?.user ? '● '+usernameFor(session.user) : '○ Guest';
  }

  N.login=async function() {
    if(!client) return status('Supabase did not load. Check your internet connection.','error');
    if(session?.user) return updateAccountUI();
    const email=$('nitroEmailInput')?.value.trim(), password=$('nitroPasswordInput')?.value || '';
    if(!email || !password) return status('Enter your email and password.','error');
    status('Logging in…');
    const {data,error}=await client.auth.signInWithPassword({email,password});
    if(error) return status(error.message,'error');
    session=data.session; updateAccountUI(); closeLogin(); toast('Logged in to NitroArcade');
    loadComments();
  };

  window.nitroSignUp=async function() {
    if(!client) return status('Supabase did not load.','error');
    const username=$('usernameInput')?.value.trim(), email=$('nitroEmailInput')?.value.trim(), password=$('nitroPasswordInput')?.value || '';
    if(!username || !email || password.length<6) return status('Enter a username, email, and password of at least 6 characters.','error');
    status('Creating account…');
    const {data,error}=await client.auth.signUp({email,password,options:{data:{username}}});
    if(error) return status(error.message,'error');
    if(data.user) await ensureProfile(data.user,username);
    session=data.session;
    updateAccountUI();
    status(data.session ? 'Account created — you are signed in.' : 'Account created. Check your email if confirmation is enabled.','ok');
    if(data.session) { closeLogin(); loadComments(); }
  };

  window.nitroSignOut=async function() {
    if(client) await client.auth.signOut();
    session=null; updateAccountUI(); closeLogin(); toast('Logged out');
  };

  window.nitroPostComment=async function() {
    if(!session?.user) { openLogin(); return status('Log in before posting a comment.','error'); }
    const input=$('nitroCommentInput'), content=input?.value.trim();
    if(!content) return;
    if(content.length>500) return toast('Comments can be up to 500 characters.');
    const payload={user_id:session.user.id,content};
    let {error}=await client.from('comments').insert(payload);
    if(error) {
      const alt=await client.from('comments').insert({user_id:session.user.id,body:content});
      error=alt.error;
    }
    if(error) return toast('Comment failed: '+error.message);
    input.value=''; await loadComments();
  };

  window.nitroDeleteComment=async function(id) {
    if(!session?.user || !id) return;
    const {error}=await client.from('comments').delete().eq('id',id).eq('user_id',session.user.id);
    if(error) toast('Delete failed: '+error.message); else loadComments();
  };

  function renderComments(rows) {
    const box=$('nitroComments'); if(!box)return;
    if(!rows?.length) { box.innerHTML='<div class="nitro-online-empty">No comments yet. Be the first 👀</div>'; return; }
    box.replaceChildren(...rows.map(row=>{
      const wrap=document.createElement('div'); wrap.className='nitro-comment';
      const top=document.createElement('div'); top.className='nitro-comment-top';
      const who=document.createElement('span'); who.className='nitro-comment-user';
      who.textContent=row.profiles?.username || row.username || 'Nitro Player';
      const when=document.createElement('span'); when.className='nitro-comment-time';
      when.textContent=row.created_at ? new Date(row.created_at).toLocaleString() : '';
      top.append(who,when);
      const body=document.createElement('div'); body.className='nitro-comment-body'; body.textContent=row.content ?? row.body ?? '';
      wrap.append(top,body);
      if(session?.user?.id===row.user_id) {
        const acts=document.createElement('div'); acts.className='nitro-comment-actions';
        const del=document.createElement('button'); del.textContent='Delete'; del.onclick=()=>nitroDeleteComment(row.id);
        acts.append(del); wrap.append(acts);
      }
      return wrap;
    }));
  }

  async function loadComments() {
    if(!client) return;
    let result=await client.from('comments').select('id,user_id,content,created_at,profiles(username)').order('created_at',{ascending:false}).limit(50);
    if(result.error) result=await client.from('comments').select('id,user_id,body,created_at,profiles(username)').order('created_at',{ascending:false}).limit(50);
    if(result.error) {
      const box=$('nitroComments'); if(box) box.innerHTML='<div class="nitro-online-empty">Comments database error: '+safe(result.error.message)+'</div>';
      return;
    }
    renderComments(result.data);
  }
  N.loadComments=loadComments;

  function makeOnlineSection() {
    if($('nitroOnlineSection')) return;
    const section=document.createElement('section'); section.id='nitroOnlineSection'; section.className='nitro-online-section';
    section.innerHTML=`
      <div class="nitro-online-head"><div><h2>Arcade Comments</h2><p>Online NitroArcade lobby • account required to post</p></div><span class="nitro-online-badge" id="nitroOnlineBadge">○ Guest</span></div>
      <div class="nitro-comment-compose"><input id="nitroCommentInput" maxlength="500" placeholder="Write a comment…"><button class="btn btn-primary" onclick="nitroPostComment()">Post</button></div>
      <div class="nitro-comments" id="nitroComments"><div class="nitro-online-empty">Loading comments…</div></div>
      `;
    const recent=document.querySelector('.recent-strip');
    if(recent?.parentElement) recent.insertAdjacentElement('afterend',section);
    else document.getElementById('dashboardView')?.append(section);
    $('nitroCommentInput')?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();nitroPostComment();}});
  }

  async function init() {
    makeOnlineSection();
    if(!window.supabase?.createClient) {
      $('nitroComments').innerHTML='<div class="nitro-online-empty">Supabase library failed to load.</div>'; return;
    }
    client=window.supabase.createClient(PROJECT_URL,PUBLISHABLE_KEY);
    const {data}=await client.auth.getSession(); session=data.session;
    updateAccountUI(); await loadComments();
    client.auth.onAuthStateChange((_event,newSession)=>{session=newSession;updateAccountUI();setTimeout(loadComments,0);});
    try {
      realtime=client.channel('nitro-comments-live')
        .on('postgres_changes',{event:'*',schema:'public',table:'comments'},()=>loadComments())
        .subscribe();
    } catch(e) { console.warn('Realtime comments unavailable:',e); }
  }
  document.readyState==='loading' ? document.addEventListener('DOMContentLoaded',init) : init();
})();
