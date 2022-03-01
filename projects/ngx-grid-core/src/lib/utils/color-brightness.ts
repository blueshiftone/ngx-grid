import { ColorMixer } from './color-mixer'

type TGridUITheme = 'light' | 'dark'

const cache: { [color: string]: IColorBrightness | null } = {}

// outputs brightness range between 0 and 1
// accepts a hex, rgb or rgba color string
export function ColorBrightness(color: string, theme: TGridUITheme = 'light'): IColorBrightness | null {

  if (typeof cache[color] === 'undefined') {

    const rgba = toRGBA(color)

    if (!rgba) cache[color] = null
    else {

      let brightness = digitalRGBLuma(rgba)

      const transparency = 1 - Math.max(0, Math.min(rgba.a, 1))

      let alignedWithTheme = false

      if (transparency > 0) {
        const lighterColor = new ColorMixer(rgba).lighten(transparency)
        const darkerColor  = new ColorMixer(rgba).darken(transparency)
        if (lighterColor && darkerColor) {
          const lightModeBrightness = digitalRGBLuma(lighterColor)
          const darkModeBrightness = digitalRGBLuma(darkerColor)
          alignedWithTheme = brightnessToThemeMode(lightModeBrightness) !== brightnessToThemeMode(darkModeBrightness)
          if (theme === 'light') brightness = lightModeBrightness
          else brightness = darkModeBrightness
        }
      }

      cache[color] = {
        color    : color,
        luma: brightness,
        mode : !alignedWithTheme ? brightnessToThemeMode(brightness): 'default'
      }

    }

  }

  return cache[color]

}

const brightnessToThemeMode = (brightness: number): TGridUITheme => {
  return brightness < 0.60 ? 'dark' : 'light'
}

const photometricRGBLuma = (rgb: IRGBA): number => {
  return ((0.2126 * rgb.r) + (0.7152 * rgb.g) + (0.0722 * rgb.b)) / 255
}

// alternate luma algorithm
const digitalRGBLuma = (rgb: IRGBA): number => {
  return ((0.299 * rgb.r) + (0.587 * rgb.g) + (0.114 * rgb.b)) / 255
}

const toRGBA = (color: string): IRGBA | null => {
  let matchResults: RegExpExecArray | null = null
  color = color.trim()

  if (matchResults = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)) { // hex
    return {
      r: parseInt(matchResults[1], 16),
      g: parseInt(matchResults[2], 16),
      b: parseInt(matchResults[3], 16),
      a: 1,
    }
  } else if (matchResults = /^rgb(?:\s+)?\((?:\s+)?(\d+)(?:\s+)?,(?:\s+)?(\d+)(?:\s+)?,(?:\s+)?(\d+)(?:\s+)?\)$/i.exec(color)) { // rgb
    return {
      r: parseInt(matchResults[1], 10),
      g: parseInt(matchResults[2], 10),
      b: parseInt(matchResults[3], 10),
      a: 1,
    }
  } else if (matchResults = /^rgb(?:a)?(?:\s+)?\((?:\s+)?(\d+)(?:\s+)?,(?:\s+)?(\d+)(?:\s+)?,(?:\s+)?(\d+)(?:\s+)?,(?:\s+)?([0-9\.]+)(?:\s+)?\)$/i.exec(color)) { // rgba
    return {
      r: parseInt(matchResults[1], 10),
      g: parseInt(matchResults[2], 10),
      b: parseInt(matchResults[3], 10),
      a: parseFloat(matchResults[4]),
    }
  }

  return null
}

export interface IRGBA {
  r: number
  g: number
  b: number
  a: number
}

export interface IColorBrightness {
  color: string
  luma  : number
  mode  : 'light' | 'dark' | 'default'
}
