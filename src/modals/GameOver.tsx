import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useStatusStore } from '../store'
import { useHistoryStore } from '../store/historyStore';

type GameOverModalProps = {
  restart: () => void;
}

export function GameOverModal({ restart }: GameOverModalProps) {
  const { isGameOver, elapsedTime, init } = useStatusStore();
  const { history, pushHistory } = useHistoryStore();
  const [isOpen, setIsOpen] = useState<boolean>(isGameOver);

  const closeModal = () => {
    setIsOpen(false);
    pushHistory(elapsedTime);
    init();
    restart();
  }

  useEffect(() => setIsOpen(isGameOver), [isGameOver]);

  const currentRecord = elapsedTime.toFixed(2);
  const bestRecord = [...history, elapsedTime].sort((a, b) => b - a)[0].toFixed(2);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl text-center font-medium leading-6 text-gray-900"
                  >
                    Game Over
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      현재 기록: {currentRecord}초
                    </p>
                    <p className="text-sm text-gray-500">
                      최고 기록: {bestRecord}초
                    </p>
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      다시하기
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
