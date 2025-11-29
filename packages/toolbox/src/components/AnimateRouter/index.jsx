import { motion, AnimatePresence } from 'framer-motion'
import { useRouterState } from '@tanstack/react-router'

export const AnimateRouter = ({ children }) => {
  const routerState = useRouterState()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routerState.location.pathname}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
export default AnimateRouter
