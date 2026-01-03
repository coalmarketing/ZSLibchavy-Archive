import EmblaCarousel from 'embla-carousel'
import { addPrevNextBtnsClickHandlers } from './embla-carousel-arrow-buttons'
import Autoplay from 'embla-carousel-autoplay'

const OPTIONS = {}

const emblaNode = document.querySelector('.embla')
const viewportNode = emblaNode.querySelector('.embla__viewport')
const prevBtnNode = emblaNode.querySelector('.embla__button--prev')
const nextBtnNode = emblaNode.querySelector('.embla__button--next')

const emblaApi = EmblaCarousel(viewportNode, OPTIONS, [Autoplay()])

const onNavButtonClick = (emblaApi) => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    const resetOrStop =
        autoplay.options.stopOnInteraction === false
            ? autoplay.reset
            : autoplay.stop

    resetOrStop()
}

const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
    emblaApi,
    prevBtnNode,
    nextBtnNode,
    onNavButtonClick
)

emblaApi.on('destroy', removePrevNextBtnsClickHandlers)
