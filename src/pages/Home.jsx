import React from 'react'
import Earth from '../components/Earth'
import '../styles/home.css'
export default function Home() {




  return (
    <>
     <nav>
      <a href="">Sphere</a>
      <ul>
        <li>Explore</li>
        <li>Create</li>
      </ul>
    </nav>
    <h1 class="title">Give it a spin</h1>
    <Earth />
    <div className='home'>
   <div className='container'>
    <h2>Ajouter un article</h2>
<div class="grid"></div>
<div id="poda">
  <div class="glow"></div>
  <div class="darkBorderBg"></div>
  <div class="darkBorderBg"></div>
  <div class="darkBorderBg"></div>

  <div class="white"></div>

  <div class="border"></div>

  <div id="main">
    <input placeholder="Titre.." type="text" name="text" class="input" />

  </div>
</div>
<div class="grid"></div>
<div id="poda">
  <div class="glow"></div>
  <div class="darkBorderBg"></div>
  <div class="darkBorderBg"></div>
  <div class="darkBorderBg"></div>

  <div class="white"></div>

  <div class="border"></div>

  <div id="main">
    <input placeholder="Article..." type="text" name="text" class="input" />

  </div>
  
</div>
<button class="button-49" role="button">Submit</button>

</div>
</div>
    </> 
  )
}
