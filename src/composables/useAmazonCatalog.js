import { ref, computed } from 'vue'
import { computedAsync } from '@vueuse/core'
import { useApiQuery } from './useApiQuery'
import { useSalesData } from './useSalesData'

const { runQuery } = useApiQuery()
const { salesData } = useSalesData()

const catalogQueue = computed(() => {
  // console.log(`Building the catalog queue...`)
  let asinsQueue = salesData.value.map((d) => d?.asin)
  const catalog = chunkArray({ array: asinsQueue, size: 20 })
  // console.log(`Finished building the catalog queue...`)
  return catalog
})
const amazonCatalog = computedAsync(
  async () => {
    // console.log(`The catalog queue has changed. Batching the catalog items...`)
    let catalog = {}

    for (const [i, identifiers] of catalogQueue.value.entries()) {
      // console.log(`Getting batch ${i + 1} from Amazon...`)
      catalog = { ...catalog, ...(await getCatalogItems({ identifiers, includedData: ['images'] })) }
    }
    // console.log(`Finished retrieving the catalog items from Amazon...`)
    return catalog
  },
  { lazy: true }
)

const getCatalogItems = async (params) => {
  try {
    const response = await runQuery({ section: 'amazon/products', action: 'getCatalogItems', params })
    return response.reduce((a, c) => {
      a[c.asin] = { imgUrl: c?.images?.[0]?.images?.[0]?.link }
      return a
    }, {})
  } catch (e) {
    console.log(e)
  }
}

const chunkArray = ({ array, size = 20 }) => {
  let chunkedArray = [...Array.from(new Set(array))]
  chunkedArray = chunkedArray.reduce((all, one, i) => {
    const ch = Math.floor(i / size)
    all[ch] = [].concat(all[ch] || [], one)
    return all
  }, [])
  return chunkedArray
}

export function useAmazonCatalog() {
  return {
    amazonCatalog: computed(() => amazonCatalog.value),
    catalogQueue: computed(() => catalogQueue.value),
  }
}
