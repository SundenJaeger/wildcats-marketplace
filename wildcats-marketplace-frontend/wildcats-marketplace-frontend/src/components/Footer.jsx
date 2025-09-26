import React from 'react'

// const Footer = () => {
//   return (
//     <div className='absolute bottom-0 left-0 w-full h-14 z-10 bg-[#350800]'>
//       <div>
//         <div className='flex items-center gap-2 p-2 justify-center'>
//             <h2 className='text-lg font-bold text-white'>Footer</h2>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Footer



function Footer(){
    return(
        <footer 
            style={{ 
                display: "flex", 
                justifyContent: "space-around", 
                padding: "40px 60px",
                background: "#350800"
            }}
        >
            <div style={{ textAlign: "left" }}>
                <h3 style={{fontWeight: "bold"}} >Wildcats MarketPlace</h3>
                <p>CIT-U: Wildcats Marketplace is a web-based application<br/> that allows verified university students to buy, sell, and share <br/>academic materials within a secure, organized platform exclusively<br/> for their campus community. The system provides course-specific<br/> categorization, identity verification, and integrated communication<br/> tools to facilitate safe and efficient transactions between students.</p>
            </div>

            <div style={{ textAlign: "center" }}>
                <h3 style={{fontWeight: "bold"}}>Group Algorythm</h3>
                <p></p>
            </div>

            <div style={{ textAlign: "center" }}>
                <h3 style={{fontWeight: "bold"}}>Group Members</h3>
                <p>John Lyster Tan Arbiol</p>
                <p>Rene John Sitoy</p>
                <p>Amiel Joshua Peñaflor</p>
                <p>John Clyde Perez</p>
                <p>Sol Angelo Singson</p>
            </div>
        </footer>
    );
}

export default Footer