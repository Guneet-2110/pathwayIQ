'use client'

import React, { useRef, useEffect } from 'react'

interface HeroProps {
  trustBadge?: { text: string; icons?: string[] }
  headline: { line1: string; line2: string }
  subtitle: string
  buttons?: {
    primary?: { text: string; onClick?: () => void; href?: string }
    secondary?: { text: string; onClick?: () => void; href?: string }
  }
  className?: string
}

const useShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl2')
    if (!gl) return

    const dpr = Math.max(1, 0.5 * window.devicePixelRatio)
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr

    const vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`

    const fragmentSrc = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}

float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}

float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) { t+=a*noise(p); p*=2.*m; a*=.5; }
  return t;
}

float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a); d=a; p*=2./(i+1.);
  }
  return t;
}

void main(void) {
  vec2 uv=(FC-.5*R)/MN, st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(0.4,0.5,1.0))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.08,bg*.06,bg*.25),d);
  }
  col*=vec3(0.6,0.65,1.4);
  O=vec4(col,1);
}`

    const vs = gl.createShader(gl.VERTEX_SHADER)!
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(vs, vertexSrc)
    gl.shaderSource(fs, fragmentSrc)
    gl.compileShader(vs)
    gl.compileShader(fs)

    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW)

    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const resLoc = gl.getUniformLocation(program, 'resolution')
    const timeLoc = gl.getUniformLocation(program, 'time')

    const resize = () => {
      const d = Math.max(1, 0.5 * window.devicePixelRatio)
      canvas.width = window.innerWidth * d
      canvas.height = window.innerHeight * d
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const loop = (now: number) => {
      gl.clearColor(0,0,0,1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.uniform1f(timeLoc, now * 1e-3)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      animationFrameRef.current = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)
    animationFrameRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return canvasRef
}

const Hero: React.FC<HeroProps> = ({ trustBadge, headline, subtitle, buttons, className = '' }) => {
  const canvasRef = useShaderBackground()

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black ${className}`}>
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-down { animation: fade-in-down 0.8s ease-out forwards; }
        .anim-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-800 { animation-delay: 0.8s; }
      `}</style>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none" style={{ background: 'black' }} />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white px-4">
        {trustBadge && (
          <div className="mb-8 anim-down">
            <div className="flex items-center gap-2 px-6 py-3 bg-indigo-500/10 backdrop-blur-md border border-indigo-300/30 rounded-full text-sm">
              {trustBadge.icons?.map((icon, i) => <span key={i}>{icon}</span>)}
              <span className="text-indigo-200">{trustBadge.text}</span>
            </div>
          </div>
        )}

        <div className="text-center space-y-6 max-w-5xl mx-auto">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent anim-up delay-200">
              {headline.line1}
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-purple-300 via-indigo-400 to-blue-300 bg-clip-text text-transparent anim-up delay-400">
              {headline.line2}
            </h1>
          </div>

          <div className="max-w-3xl mx-auto anim-up delay-600">
            <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed">{subtitle}</p>
          </div>

          {buttons && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 anim-up delay-800">
              {buttons.primary && (
                
                  href={buttons.primary.href || '#'}
                  onClick={buttons.primary.onClick}
                  className="px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25"
                >
                  {buttons.primary.text}
                </a>
              )}
              {buttons.secondary && (
                
                  href={buttons.secondary.href || '#'}
                  onClick={buttons.secondary.onClick}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-indigo-300/50 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  {buttons.secondary.text}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Hero
