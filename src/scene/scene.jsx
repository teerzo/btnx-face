import { createRoot } from 'react-dom/client'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useGraph } from '@react-three/fiber'

import { useLoader } from '@react-three/fiber'

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import Muscle from '../muscle/muscle';
import Misc from '../misc/misc';

function Box(props) {
    // This reference will give us direct access to the mesh
    const meshRef = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (meshRef.current.rotation.x += delta))
    // Return view, these are regular three.js elements expressed in JSX
    return (

        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>

    )
}

export default function Scene() {

    const loader = new OBJLoader();
    const [muscles, setMuscles] = useState([]);
    const [misc, setMisc] = useState([]);

    useEffect(() => {
        const fetchMuscles = async () => {
            try {
                console.log('fetchMuscles');
                const response = await fetch("./data/muscles.json");
                const json = await response.json();

                console.log('json', json);


                if (json?.misc) {
                    let _misc = [];
                    for (let i = 0; i < json?.misc.length; i++) {
                        // console.log('muscle', json.muscles[i]);
                        if (!json.misc[i].skipLoad) {
                            _misc.push(json.misc[i])
                        }
                    }
                    setMisc(_misc);
                }
                if (json?.muscles) {
                    let _muscles = [];
                    for (let i = 0; i < json?.muscles.length; i++) {
                        // console.log('muscle', json.muscles[i]);
                        if (!json.muscles[i].skipLoad) {
                            _muscles.push(json.muscles[i])
                        }
                    }
                    setMuscles(_muscles);
                }
            }
            catch (error) {
                console.log('error', error);
            }
        }

        const result = fetchMuscles();
    }, [])

    return (
        <>
            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />
            {/* {...muscles} */}

            {muscles.map((item, key) => {
                return (
                    <Muscle key={key} data={item} />
                )
            })}

            {misc.map((item, key) => {
                return (
                    <Misc key={key} data={item} />
                )
            })}
        </>


        // <Canvas>  
        //     <ambientLight />
        //     <pointLight position={[10, 10, 10]} />
        //     <Box position={[-1.2, 0, 0]} />
        //     <Box position={[1.2, 0, 0]} />
        // </Canvas>
    )
}