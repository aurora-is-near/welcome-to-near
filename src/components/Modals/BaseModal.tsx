"use client";
import { Fragment, ReactNode } from "react";
import {
  Dialog,
  DialogBackdrop,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface Props {
  children?: ReactNode;
  mobileTitle?: ReactNode;
  maxWidthClassName?: string;
  wrapperClassName?: string;
  paddingClassName?: string;
  bgClassName?: string;
  show: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
  blur?: boolean;
}
const Modal = ({
  children,
  mobileTitle,
  wrapperClassName = "",
  paddingClassName = "p-5 sm:p-8",
  bgClassName = "bg-sand-1",
  show,
  onClose = () => {},
  showCloseButton = true,
  blur = false,
}: Props) => (
  <Transition show={show} as={Fragment}>
    <Dialog
      as="div"
      className="fixed inset-0 z-50 overflow-y-auto"
      static
      open={show}
      onClose={onClose}
    >
      <div className="min-h-screen px-4 text-center">
        <TransitionChild
          as="div"
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop
            className={clsx("fixed inset-0 bg-black bg-opacity-75", {
              "backdrop-blur": blur,
            })}
          />
        </TransitionChild>
        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div
            className={clsx(
              "sm:relative sm:my-8 sm:h-fit sm:max-w-lg sm:rounded-2xl sm:align-middle absolute inset-0 inline-block h-full w-full",
              wrapperClassName
            )}
          >
            <div
              className={clsx(
                "sm:rounded-2xl sm:shadow-custom-lg h-full transform transition-all",
                bgClassName,
                paddingClassName
              )}
            >
              <div className="sm:hidden flex items-center justify-between py-6">
                {mobileTitle}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="ml-auto text-sand-12"
                  >
                    <XMarkIcon className="h-8 w-8" />
                  </button>
                )}
              </div>
              {children}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="sm:block absolute -right-14 -top-3 hidden rounded-full p-2 text-sand-8 hover:bg-sand-1 hover:text-sand-12"
                >
                  <XMarkIcon className="h-8 w-8" />
                </button>
              )}
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </Transition>
);

export default Modal;
