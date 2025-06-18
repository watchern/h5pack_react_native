import sharp from 'sharp'
import { resolve } from 'path'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { GENERATE_CIRCLE_ICON_ERROR, GENERATE_SOURCE_ERROR, resourceMap, roundName, squareName, } from 'src/const'
import { argument } from './agument'
import { GenerateError } from 'src/base/error'
import { otherSpinner } from 'src/base/spinner'

function shapeFn(
  diameter: number,
  inputImagePath: string,
  outputImagePath: string,
  roundDegree: number = 50
) {
  return new Promise(resolve => {
    const r = diameter / (100/roundDegree),
      // circleShape = Buffer.from(
      //   `<svg><circle cx="${r}" cy="${r}" r="${r}" /></svg>`
      // )
    // 矩形 <ellipse cx="100" cy="100" rx="90" ry="50" stroke="black" stroke-width="3" fill="rgb(121,0,121)">
    circleShape = Buffer.from(
      `<svg><rect x="0" y="0" width="${diameter}" height="${diameter}" rx="${roundDegree}" ry="${roundDegree}"/></svg>`
    );

    sharp(inputImagePath)
      .resize(diameter, diameter)
      .composite([
        {
          input: circleShape,
          blend: 'dest-in',
        },
      ])

      .toFile(outputImagePath, (err, info) => {
        resolve(true)
        if (err) {
          throw new GenerateError(GENERATE_CIRCLE_ICON_ERROR, err.message)
        }
      })
  })
}

export async function svgHandle() {
  try {
    const outputBaseDir = argument['--output'] || './'
    const inputFile = argument['--input'] || './public/logo.svg'

    const sourceBuffer = argument.sourceBuffer!
    for (const item of resourceMap) {

      console.log('dsfee1')
      const dirPath = resolve(process.cwd(), outputBaseDir, item.dirname)
      console.log('dsfee2')
      if (!existsSync(dirPath)) {
        // recursive:true 创建深层级的目录
        await mkdir(dirPath, {recursive: true})
      }
      console.log('dsfee3')
      // const pngBuffer = await svg2png(sourceBuffer, {
      // 	width: item.size,
      // 	height: item.size,
      // })
      // await writeFile(
      // 	resolve(process.cwd(), outputBaseDir, item.dirname, squareName),
      // 	pngBuffer
      // )
      console.log(process.cwd(), argument['--input'])
      await shapeFn(
        item.size,
        resolve(process.cwd(), inputFile),
        resolve(process.cwd(), outputBaseDir, item.dirname, squareName),
				1
      )
      await shapeFn(
        item.size,
        resolve(process.cwd(), outputBaseDir, item.dirname, squareName),
        resolve(process.cwd(), outputBaseDir, item.dirname, roundName)
      )
      otherSpinner.succeed(`✅ Generate Success In ${item.dirname}`)
    }
  } catch (error: any) {
    throw new GenerateError(GENERATE_SOURCE_ERROR, error.message)
  }
}
