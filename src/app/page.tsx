  "use client";

  import { useEffect, useRef, useState } from "react";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  gsap.registerPlugin(ScrollTrigger);

  // Componente Tile con animación cíclica coordinada
  function Tile({ 
    src, 
    alt, 
    tileRef, 
    style,
    tileIndex,
    onAnimate
  }: { 
    src: string; 
    alt: string; 
    tileRef: React.RefObject<HTMLImageElement | null>; 
    style: React.CSSProperties;
    tileIndex: number;
    onAnimate: (index: number, callback: () => void) => void;
  }) {
    useEffect(() => {
      if (!tileRef.current) return;

      const animateTile = () => {
        if (!tileRef.current) return;
        
        // Detener cualquier animación previa
        gsap.killTweensOf(tileRef.current);
        
        // Elegir dirección aleatoria (arriba o abajo) - 20px
        const direction = Math.random() < 0.5 ? -20 : 20;
        
        // Animar hacia la nueva posición
        gsap.to(tileRef.current, {
          y: direction,
          duration: 0.3,
          ease: "back.out(3)",
        });
      };

      // Registrar este tile para animación cíclica
      onAnimate(tileIndex, animateTile);

      // Cleanup
      return () => {
        if (tileRef.current) {
          gsap.killTweensOf(tileRef.current);
        }
      };
    }, [tileRef, tileIndex, onAnimate]);

    return (
      <img
        ref={tileRef}
        src={src}
        alt={alt}
        className="absolute pointer-events-none"
        style={style}
      />
    );
  }

  // Función para generar el path de la onda
  function generateWavePath(
    width: number = 1200,
    height: number = 120,
    baseY: number = 80,
    waveSpacing: number = 50, // Distancia entre cada punto más alto (frecuencia)
    waveAmplitude: number = 25 // Altura de la onda (diferencia desde baseY)
  ) {
    const peakY = baseY - waveAmplitude; // Y del punto más alto
    const path: string[] = [];
    
    // Empezar en el punto inicial
    path.push(`M0,${baseY}`);
    
    // Generar ondas
    let currentX = 0;
    let isFirstWave = true;
    
    while (currentX < width) {
      const peakX = currentX + waveSpacing / 2; // Punto medio donde está el pico
      const nextX = Math.min(currentX + waveSpacing, width);
      
      if (isFirstWave) {
        // Primera onda: usar Q (curva cuadrática)
        // Q controlX,controlY endX,endY
        path.push(`Q${peakX},${peakY} ${nextX},${baseY}`);
        isFirstWave = false;
      } else {
        // Siguientes ondas: usar T (continúa la curva suavemente)
        // T endX,endY - refleja automáticamente el punto de control anterior
        path.push(`T${nextX},${baseY}`);
      }
      
      currentX = nextX;
    }
    
    // Cerrar el path
    path.push(`L${width},${height}`);
    path.push(`L0,${height}`);
    path.push('Z');
    
    return path.join(' ');
  }

  export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);
    const portadaRef = useRef<HTMLDivElement>(null);
    const seccion2Ref = useRef<HTMLDivElement>(null);
    const assetContainerRef = useRef<HTMLDivElement>(null);
    const classiccsRef = useRef<HTMLImageElement>(null);
    const classiccsSvgRef = useRef<HTMLImageElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const gamechatRef = useRef<HTMLDivElement>(null);
    const cBoxRef = useRef<HTMLDivElement>(null);
    const nintendoRef = useRef<HTMLImageElement>(null);
    const nubeRef = useRef<HTMLImageElement>(null);
  const upArrowRef = useRef<HTMLImageElement>(null);
  const downArrowRef = useRef<HTMLImageElement>(null);
  const musicContainerRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<HTMLImageElement>(null);
  const t1Ref = useRef<HTMLImageElement>(null);
  const t2Ref = useRef<HTMLImageElement>(null);
  const t3Ref = useRef<HTMLImageElement>(null);
  const t4Ref = useRef<HTMLImageElement>(null);
  const t5Ref = useRef<HTMLImageElement>(null);
  const t6Ref = useRef<HTMLImageElement>(null);
  const t7Ref = useRef<HTMLImageElement>(null);
  const finalSectionRef = useRef<HTMLDivElement>(null);
  const nintendoTextRef = useRef<HTMLDivElement>(null);
  const classicsTextRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(1200);
  
  // Sistema de coordinación cíclica para los tiles
  const tileAnimationsRef = useRef<Map<number, () => void>>(new Map());
  const currentTileIndexRef = useRef(0);
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Función para registrar animaciones de tiles
  const registerTileAnimation = (index: number, animationFn: () => void) => {
    tileAnimationsRef.current.set(index, animationFn);
  };

  // Sistema de animación cíclica
  useEffect(() => {
    const totalTiles = 7;
    const delayBetweenTiles = 400; // 400ms entre cada tile
    const cycleDelay = 2000; // 2 segundos antes de empezar el ciclo

    const animateNextTile = () => {
      const animationFn = tileAnimationsRef.current.get(currentTileIndexRef.current);
      if (animationFn) {
        animationFn();
      }
      
      // Avanzar al siguiente tile (cíclico)
      currentTileIndexRef.current = (currentTileIndexRef.current + 1) % totalTiles;
    };

    // Verificar que todos los tiles estén registrados antes de iniciar
    const checkAndStart = () => {
      if (tileAnimationsRef.current.size >= totalTiles) {
        animateNextTile();
        
        // Configurar intervalo para el ciclo continuo
        cycleIntervalRef.current = setInterval(() => {
          animateNextTile();
        }, delayBetweenTiles);
      } else {
        // Reintentar después de un breve delay
        setTimeout(checkAndStart, 100);
      }
    };

    // Ejecutar el primer tile después del delay inicial
    const initialTimeout = setTimeout(() => {
      checkAndStart();
    }, cycleDelay);

    // Cleanup
    return () => {
      clearTimeout(initialTimeout);
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
      }
    };
  }, []);

    // Detectar cambios en el ancho de la ventana
    useEffect(() => {
      const updateWidth = () => {
        setWindowWidth(window.innerWidth);
      };

      // Establecer el ancho inicial
      updateWidth();

      // Escuchar cambios de tamaño
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // Calcular el espaciado de ondas basado en el ancho de la ventana
    // Mantiene aproximadamente 50px de espaciado mínimo, pero ajusta para que quepan ondas completas
    const minWaveSpacing = 50; // Espaciado mínimo deseado
    const numWaves = Math.max(1, Math.floor(windowWidth / minWaveSpacing));
    const waveSpacing = windowWidth / numWaves;
    
    // Parámetros del patrón ondulado
    const baseY = 80; // Posición Y de la línea base de la onda
    const waveAmplitude = 25; // Altura de la onda desde la base
    const svgHeight = baseY + 20; // Altura del SVG ajustada al patrón (baseY + pequeño margen)

    // Precarga de imágenes antes de inicializar animaciones
    useEffect(() => {
      const images = [
        '/switchLogo.png',
        '/Clasiccs.avif',
        '/Clasiccs.svg',
        '/music.svg',
        '/GameChat.svg',
        '/Nintendo.png',
        '/nube.png',
        '/UpArrow.svg',
        '/DownArrow.svg',
        '/T1.svg',
        '/T2.svg',
        '/T3.svg',
        '/T4.svg',
        '/T5.svg',
        '/T6.svg',
        '/T7.svg',
      ];

      // Precargar todas las imágenes
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }, []);

    useEffect(() => {
      if (!containerRef.current || !seccion2Ref.current || !gamechatRef.current || !cBoxRef.current || !nintendoRef.current || !nubeRef.current || !upArrowRef.current || !downArrowRef.current || !assetContainerRef.current || !classiccsRef.current || !classiccsSvgRef.current || !musicContainerRef.current || !musicRef.current || !t1Ref.current || !t2Ref.current || !t3Ref.current || !t4Ref.current || !t5Ref.current || !t6Ref.current || !t7Ref.current || !finalSectionRef.current || !nintendoTextRef.current || !classicsTextRef.current) return;
    
      const container = containerRef.current;
      const seccion2 = seccion2Ref.current;
      const assetContainer = assetContainerRef.current;
      const classiccs = classiccsRef.current;
      const classiccsSvg = classiccsSvgRef.current;
      const gamechat = gamechatRef.current;
      const cBox = cBoxRef.current;
      const nintendo = nintendoRef.current;
      const nube = nubeRef.current;
      const upArrow = upArrowRef.current;
      const downArrow = downArrowRef.current;
      const musicContainer = musicContainerRef.current;
      const music = musicRef.current;
      const finalSection = finalSectionRef.current;
      const nintendoText = nintendoTextRef.current;
      const classicsText = classicsTextRef.current;
      const scrollDistance = window.innerHeight;
    
      // Configurar estado inicial del recuadro, Nintendo, nube y flechas
      gsap.set(cBox, { opacity: 0 });
      gsap.set(nintendo, { x: window.innerWidth }); // Empieza fuera de pantalla a la derecha
      gsap.set(nube, { opacity: 0, scale: 0.8 }); // Empieza invisible y un poco más pequeña
      gsap.set(upArrow, { opacity: 0, y: 30 }); // Empieza invisible y un poco más abajo
      gsap.set(downArrow, { opacity: 0, y: -30 }); // Empieza invisible y un poco más arriba
      
      // Configurar estado inicial de los textos: empiezan invisibles
      gsap.set(nintendoText, { opacity: 0 });
      gsap.set(classicsText, { opacity: 0 });
      
      // Configurar estado inicial del asset: empieza abajo del contenedor
      gsap.set(classiccs, { y: window.innerHeight }); // Empieza debajo del contenedor
      
      // Configurar estado inicial del SVG: empieza invisible en escala 1.3
      gsap.set(classiccsSvg, { opacity: 0, scale: 1.25 , y: -5, x: -5}); // Empieza invisible en escala 1.3
      
      // Configurar estado inicial del contenedor de music: empieza abajo del contenedor
      gsap.set(musicContainer, { y: window.innerHeight }); // Empieza debajo del contenedor
      
      // Configurar estado inicial de la sección final: empieza más abajo para que las ondas no se vean
      gsap.set(finalSection, { y: window.innerHeight + svgHeight }); // Empieza más abajo para ocultar las ondas
    
      // Timeline controlado por *un solo* ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          // Añadimos distancia para el deslizamiento del asset y las nuevas animaciones
          end: () => `+=${scrollDistance * 7.5}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1
        },
      });
    
      // 1) Subida de seccion2
      tl.fromTo(
        seccion2,
        { y: 0 },
        {
          y: -scrollDistance,
          ease: "none",
          duration: 1, // representa la primera parte del scroll
        }
      );
    
      // 2) Escalado de GameChat – empieza justo al terminar lo anterior
      tl.to(
        gamechat,
        {
          x: -155,
          scale: 2.5,
          ease: "power2.out",
          transformOrigin: "center center",
          duration: 1,
        },
        ">",
      );
    
      // 3) Aparecer recuadro y desaparecer GameChat - empieza un poco antes del final del escalado
      tl.to(
        cBox,
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.3" // Empieza 0.3 antes de que termine el escalado
      )
      .to(
        gamechat,
        {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        },
        "-=0.6" // Empieza al mismo tiempo que el recuadro y termina junto con el escalado
      );
    
      // 4) Desplazar recuadro a la izquierda y Nintendo desde la derecha
      tl.to(
        cBox,
        {
          x: -window.innerWidth - 300, // Sale completamente por la izquierda
          duration: 0.6,
          ease: "power2.in",
        }
      )
      .fromTo(
        nintendo,
        {
          x: window.innerWidth, // Empieza fuera de pantalla a la derecha
        },
        {
          x: 0, // Termina en el centro
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4" // Empieza al mismo tiempo que el recuadro sale
      );
    
      // 5) Escalar Nintendo, bajarlo y aparecer nube desde detrás
      tl.to(
        nintendo,
        {
          scale: 0.8,
          y: "30%",
          duration: 0.5,
          ease: "power2.out",
        }
      )
      .to(
        nube,
        {
          y: "-160%",
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3" // Empieza un poco antes de que termine el movimiento de Nintendo
      );
    
      // 6) Aparecer flechas entre nube y Nintendo con movimiento
      tl.to(
        upArrow,
        {
          opacity: 1,
          y: 0, // Viene desde abajo hacia su posición final
          duration: 0.4,
          ease: "power2.out",
        }
      )
      .to(
        downArrow,
        {
          opacity: 1,
          y: 0, // Viene desde arriba hacia su posición final
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.4" // Empieza al mismo tiempo que upArrow
      );

      // 7) Deslizar el asset hacia arriba
      tl.to(
        classiccs,
        {
          y: 0, // Se desliza desde abajo hacia arriba
          ease: "none",
          duration: 1,
        },
        ">" // Empieza después de que terminen las flechas
      );

      // 8) Desvanecer AVIF, aparecer SVG y desaparecer elementos de fondo (flechas, nube, Nintendo)
      tl.to(
        classiccs,
        {
          opacity: 0, // Desvanecer el AVIF
          duration: 0.6,
          ease: "power2.in",
        },
        ">" // Empieza después de que termine el deslizamiento
      )
      .to(
        classiccsSvg,
        {
          opacity: 1, // Aparecer el SVG
          scale: 1.25, // Aparece directamente en escala 1.25 (sin animación de crecimiento)
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.6" // Empieza al mismo tiempo que el fade out del AVIF
      )
      .to(
        upArrow,
        {
          opacity: 0, // Desaparecer flecha arriba
          duration: 0.6,
          ease: "power2.in",
        },
        "-=0.6" // Empieza al mismo tiempo que aparece el SVG
      )
      .to(
        downArrow,
        {
          opacity: 0, // Desaparecer flecha abajo
          duration: 0.6,
          ease: "power2.in",
        },
        "-=0.6" // Empieza al mismo tiempo que aparece el SVG
      )
      .to(
        nube,
        {
          opacity: 0, // Desaparecer nube
          duration: 0.6,
          ease: "power2.in",
        },
        "-=0.6" // Empieza al mismo tiempo que aparece el SVG
      )
      .to(
        nintendo,
        {
          opacity: 0, // Desaparecer Nintendo
          duration: 0.6,
          ease: "power2.in",
        },
        "-=0.6" // Empieza al mismo tiempo que aparece el SVG
      )
      .to(
        nintendoText,
        {
          opacity: 1, // Aparecer texto "Nintendo"
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.6" // Empieza al mismo tiempo que desaparecen los otros elementos
      )
      .to(
        classicsText,
        {
          opacity: 1, // Aparecer texto "Classics"
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.6" // Empieza al mismo tiempo que desaparecen los otros elementos
      );

      // 9) Reducir el SVG a 0.5 y girar
      tl.to(
        classiccsSvg,
        {
          scale: 0.5, // Reducir a tamaño final
          rotate: -10, // Girar
          duration: 0.8,
          ease: "power2.inOut",
        },
        ">" // Empieza después de que aparezca el SVG
      );

      // 10) Deslizar el contenedor de music hacia arriba para cubrir la pantalla
      tl.to(
        musicContainer,
        {
          y: 0, // Se desliza desde abajo hacia arriba para cubrir la pantalla
          ease: "none",
          duration: 1,
        },
        ">" // Empieza después de que termine la animación del SVG
      );

      // 11) Deslizar la sección final (div blanco) hacia arriba para cubrir la pantalla
      tl.to(
        finalSection,
        {
          y: 0, // Se desliza desde abajo hacia arriba para cubrir la pantalla
          ease: "none",
          duration: 1,
        },
        ">" // Empieza después de que termine la animación del contenedor de music
      );
      
    
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    }, []);
    

    // Animación del logo: aparece desde abajo con fade-in
    useEffect(() => {
      if (!logoRef.current) return;

      gsap.fromTo(
        logoRef.current,
        {
          y: 50,      // Empieza 50px más abajo
          opacity: 0, // Empieza invisible
        },
        {
          y: 0,        // Termina en su posición original (centro)
          opacity: 1,  // Termina completamente visible
          duration: 1, // Duración de 1 segundo
          ease: "power2.out", // Easing suave
        }
      );
    }, []);

    return (
      <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
        {/* Portada - Fondo fijo */}
        <div
          ref={portadaRef}
          className="absolute top-0 left-0 w-full h-full bg-[#e60012] flex items-center justify-center z-10"
        >
          {/* Logo */}
          <img 
            ref={logoRef}
            src="/switchLogo.png" 
            alt="Logo"  
            className="h-84 w-auto"
          />
        </div>

        {/* Seccion2 - Sube desde abajo */}
        <div
          ref={seccion2Ref}
          className="absolute top-0 left-0 w-full h-full bg-white flex flex-col items-center justify-center z-30"
          style={{ willChange: "transform", top: "100vh" }}
        >
          {/* Patrón Ondulado en la parte superior */}
          <div className="absolute top-0 left-0 w-full pointer-events-none z-40" style={{ transform: "translateY(-100%)" }}>
            <svg
              className="w-full"
              viewBox={`0 0 ${windowWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              style={{ height: `${svgHeight}px`, display: "block" }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={generateWavePath(
                  windowWidth,  // width: ancho dinámico basado en la ventana
                  svgHeight,   // height: altura ajustada al patrón
                  baseY,        // baseY: posición Y de la línea base de la onda
                  waveSpacing,  // waveSpacing: calculado dinámicamente para mantener forma constante
                  waveAmplitude // waveAmplitude: altura de la onda desde la base
                )}
                fill="white"
              />
            </svg>
          </div>

          {/* GameChat */}
          <div ref={gamechatRef} className="text-8xl font-bold text-[#f58d14] select-none">
            GameChat
          </div>

          {/* Recuadro central - Imagen GameChat */}
          <div
            ref={cBoxRef}
            className="absolute pointer-events-none"
            style={{
              width: "300px",
              height: "300px",
              opacity: 0,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <img
              src="/GameChat.svg"
              alt="GameChat"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Imagen Nintendo - Entra desde la derecha */}
          <img
            ref={nintendoRef}
            src="/Nintendo.png"
            alt="Nintendo"
            className="absolute pointer-events-none"
            style={{
              width: "auto",
              height: "55%",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
              zIndex: 35,
            }}
          />

          {/* Imagen Nube - Aparece desde detrás de Nintendo */}
          <img
            ref={nubeRef}
            src="/nube.png"
            alt="Nube"
            className="absolute pointer-events-none"
            style={{
              width: "auto",
              height: "20%",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
              zIndex: 34, // Detrás de Nintendo
            }}
          />

          {/* Flechas - UpArrow (izquierda) y DownArrow (derecha) */}
          <img
            ref={upArrowRef}
            src="/UpArrow.svg"
            alt="Up Arrow"
            className="absolute pointer-events-none"
            style={{
              width: "auto",
              height: "12%",
              top: "36%",
              left: "calc(50% - 40px)", // A la izquierda del centro
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
              zIndex: 36,
              opacity: 0,
            }}
          />
          <img
            ref={downArrowRef}
            src="/DownArrow.svg"
            alt="Down Arrow"
            className="absolute pointer-events-none"
            style={{
              width: "auto",
              height: "12%",
              top: "36%",
              left: "calc(50% + 40px)", // A la derecha del centro
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
              zIndex: 36,
              opacity: 0,
            }}
          />
        </div>

        {/* Contenedor del asset con overflow hidden */}
        <div
          ref={assetContainerRef}
          className="absolute top-0 left-0 w-full h-full overflow-hidden z-50"
          style={{ willChange: "transform" }}
        >
          {/* Imagen AVIF - se desvanece */}
          <img
            ref={classiccsRef}
            src="/Clasiccs.avif"
            alt="Classics"
            className="w-full h-full object-contain pointer-events-none bg-[#e60012]"
          />
          
          {/* Imagen SVG - aparece encima y luego se reescala */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <img
              ref={classiccsSvgRef}
              src="/Clasiccs.svg"
              alt="Classics SVG"
              className="w-full h-full object-contain pointer-events-none"
              style={{
                willChange: "transform, opacity",
                scale: 1.3,
              }}
            />
          </div>
        </div>

        {/* Textos "Nintendo" y "Classics" a los lados */}
        <div
          ref={nintendoTextRef}
          className="absolute top-1/2 left-8 transform -translate-y-1/2 pointer-events-none z-45"
          style={{
            top: '20%',
            left: '15%',
            textOrientation: 'mixed',
          }}
        >
          <span className="text-8xl md:text-9xl font-bold text-[#e60012] opacity-70 select-none">
            Nintendo
          </span>
        </div>
        <div
          ref={classicsTextRef}
          className="absolute top-1/2 right-8 transform -translate-y-1/2 pointer-events-none z-45"
          style={{
            top: '78%',
            right: '15%',
            textOrientation: 'mixed',
          }}
        >
          <span className="text-8xl md:text-9xl font-bold text-[#e60012] opacity-70 select-none">
            Classics
          </span>
        </div>

          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-black">
        </div>

        {/* Contenedor de Music con tiles */}
        <div
          ref={musicContainerRef}
          className="absolute top-0 left-0 w-full h-full overflow-hidden z-60"
          style={{ willChange: "transform" }}
        >
          {/* Imagen Music AVIF */}
          <img
            ref={musicRef}
            src="/music.svg"
            alt="Music"
            className="w-full h-full object-contain pointer-events-none bg-[#e60012]"
          />
          
          {/* Tiles T1 a T7 posicionados sobre la imagen */}
          <Tile
            tileRef={t1Ref}
            src="/T1.svg"
            alt="Tile 1"
            tileIndex={0}
            onAnimate={registerTileAnimation}
            style={{
              width: "7.8%",
              height: "auto",
              top: "40%",
              left: "21.5%",
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
            }}
          />
          <Tile
            tileRef={t2Ref}
            src="/T2.svg"
            alt="Tile 2"
            tileIndex={1}
            onAnimate={registerTileAnimation}
            style={{
              width: "81%",
              height: "auto",
              top: "50%",
              left: "49.9%",
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
            }}
          />
          <Tile
            tileRef={t3Ref}
            src="/T3.svg"
            alt="Tile 3"
            tileIndex={2}
            onAnimate={registerTileAnimation}
            style={{
              width: "81%",
              height: "auto",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
            }}
          />
          <Tile
            tileRef={t4Ref}
            src="/T4.svg"
            alt="Tile 4"
            tileIndex={3}
            onAnimate={registerTileAnimation}
            style={{
              width: "81%",
              height: "auto",
              top: "49.95%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
            }}
          />
          <Tile
            tileRef={t5Ref}
            src="/T5.svg"
            alt="Tile 5"
            tileIndex={4}
            onAnimate={registerTileAnimation}
            style={{
              width: "81%",
              height: "auto",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
            }}
          />
          <Tile
            tileRef={t6Ref}
            src="/T6.svg"
            alt="Tile 6"
            tileIndex={5}
            onAnimate={registerTileAnimation}
            style={{
              width: "81%",
              height: "auto",
              top: "50%",
              left: "50.05%",
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
            }}
          />
          <Tile
            tileRef={t7Ref}
            src="/T7.svg"
            alt="Tile 7"
            tileIndex={6}
            onAnimate={registerTileAnimation}
            style={{
              width: "7.5%",
              height: "auto",
              top: "33%",
              left: "78.5%",
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Sección Final - Div blanco con texto y botón */}
        <div
          ref={finalSectionRef}
          className="absolute top-0 left-0 w-full h-full bg-white flex flex-col items-center justify-center z-70"
          style={{ willChange: "transform" }}
        >
          {/* Patrón Ondulado en la parte superior */}
          <div className="absolute top-0 left-0 w-full pointer-events-none z-80" style={{ transform: "translateY(-99%)" }}>
            <svg
              className="w-full"
              viewBox={`0 0 ${windowWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              style={{ height: `${svgHeight}px`, display: "block" }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={generateWavePath(
                  windowWidth,  // width: ancho dinámico basado en la ventana
                  svgHeight,   // height: altura ajustada al patrón
                  baseY,        // baseY: posición Y de la línea base de la onda
                  waveSpacing,  // waveSpacing: calculado dinámicamente para mantener forma constante
                  waveAmplitude // waveAmplitude: altura de la onda desde la base
                )}
                fill="white"
              />
            </svg>
          </div>

          {/* Contenido: Texto y Botón */}
          <div className="flex flex-col items-center justify-center gap-12 z-90 px-8">
            {/* Texto */}
            <p className="text-7xl md:text-7xl lg:text-7xl font-semibold text-center text-[#e60012] max-w-5xl leading-tight">
              Compare the plans and choose the best one for you
            </p>
            
            {/* Botón */}
            <button 
              className="bg-white border-[#e60012] text-[#e60012] px-12 py-6 rounded-lg font-bold text-2xl md:text-3xl hover:bg-[#e60012] hover:text-white hover:scale-105 hover:shadow-lg active:scale-100 transition-all duration-300 cursor-pointer"
              style={{ borderWidth: '3px' }}
              onClick={() => {
                window.open('https://ec.nintendo.com/CO/es/membership/?_gl=1*6iqlj9*_ga*NTEwMDg0Nzg3LjE3NjA5ODYyNDg.*_ga_F6ERC4HMNZ*czE3NjQ1NzAxNTQkbzEwJGcxJHQxNzY0NTcwMTU3JGo1OCRsMCRoMTQ3NDU1MTEy*_gcl_aw*R0NMLjE3NjQ1NzAxNTUuQ2p3S0NBaUE4Nl9KQmhBSUVpd0E0aTlKdS1rcmxoazNIdk5yeFd4WFk1U0drVXloWGJqeTk2cDU0RkVDckdBeEZzM04tZU1ORDNmd0tSb0NWaEFRQXZEX0J3RQ..*_gcl_au*MjEzNDg5Nzk5MS4xNzYxMjUzNDk4', '_blank');
              }}
            >
              Sign up today!
            </button>
          </div>
        </div>
      </div>
    );
  }
