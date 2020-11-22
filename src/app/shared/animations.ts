import {
  animate,
  AnimationTriggerMetadata,
  keyframes,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

export const leftLoadTrigger: AnimationTriggerMetadata =
  trigger( 'loadLeft', [
    state( 'in', style( { transform: 'translateX(0)' } ) ),
    transition( 'void => *', [
      style( { transform: 'translateX(-20px)' } ),
      animate( 100 )
    ] )
  ] );

export const opacityLoadTrigger: AnimationTriggerMetadata =
  trigger( 'opacityUp', [
    state( 'in', style( { opacity: 1 } ) ),
    transition( 'void => *', [
      style( { opacity: 0 } ),
      animate( 200 )
    ] )
  ] );

export const pushTrigger: AnimationTriggerMetadata =
  trigger( 'push', [
    state( 'in', style( {
                          transform: 'scale(0)'
                        } ) ),
    transition( 'void => *', [
      animate( 200, keyframes( [
                                 style( {
                                          transform: 'scale(0)'
                                        } ),
                                 style( {
                                          transform: 'scale(0.3)'
                                        } ),
                                 style( {
                                          transform: 'scale(0.6)'
                                        } ),
                                 style( {
                                          transform: 'scale(0.9)'
                                        } ),
                                 style( {
                                          transform: 'scale(1.2)'
                                        } ),
                                 style( {
                                          transform: 'scale(1)'
                                        } )
                               ] ) )
    ] ),
    state( 'out', style( {
                           transform: 'scale(1)'
                         } ) ),
    transition( '* => void', [
      animate( 200, keyframes( [
                                 style( {
                                          transform: 'scale(1)'
                                        } ),
                                 style( {
                                          transform: 'scale(1.2)'
                                        } ),
                                 style( {
                                          transform: 'scale(0.9)'
                                        } ),
                                 style( {
                                          transform: 'scale(0.6)'
                                        } ),
                                 style( {
                                          transform: 'scale(0.3)'
                                        } ),
                                 style( {
                                          transform: 'scale(0)'
                                        } )
                               ] ) )
    ] )
  ] );
