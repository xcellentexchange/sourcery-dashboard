import { ref, computed } from 'vue'
import { useAmazonCatalog } from './useAmazonCatalog'

const { amazonCatalog } = useAmazonCatalog()

export function useProductImage() {
  const productAsin = ref(null)
  const productImage = computed(() => amazonCatalog?.value?.[productAsin.value]?.imgUrl)

  const setProductAsin = (asin) => (productAsin.value = asin)

  return {
    setProductAsin,
    productImage,
  }
}
