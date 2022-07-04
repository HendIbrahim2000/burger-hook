import React, { useState } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Auxel from '../Auxel/Auxel';

import useHttpErrorHandler from '../../hooks/http-error-handler'



const withErrorHandler = ( WrappedComponent, axios ) => {


    return (props)=> {
        const [error, errorHandler] = useHttpErrorHandler(axios)

        

            return (
                <Auxel>
                    <Modal
                        show={error}
                        modalClosed={errorHandler}>
                        {error ? error.message : null}
                    </Modal>
                    <WrappedComponent {...props} />
                </Auxel>
            );
        }
    }

export default withErrorHandler;