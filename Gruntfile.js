/**
 * Created by xiuchengquek on 29/04/2016.
 */
/**
 * Created by xiuchengquek on 25/02/2016.
 */

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';\n',
            },
            libraries : {
                    src: ['public/lib/jquery/dist/jquery.min.js',
                    'public/lib/bootstrap/dist/js/bootstrap.min.js',
                    'public/lib/angular/angular.js',
                    'public/lib/angular-resource/angular-resource.min.js',
                    'public/lib/angular-smart-table/dist/smart-table.min.js',
                    'public/lib/lodash/dist/lodash.js',
                    'public/lib/d3/d3.min.js',
                     ],
                dest: 'skinRef/static/js/dependencies.js'

            },
            user_code : {

                    src: ['skinRef/skinRefApp/static/js/skinRefApp/*.js'],
                    dest: 'skinRef/skinRefApp/static/js/built/skinRefApp.built.js'
            },
             user_code_local : {
                    src: ['skinRef/skinRefApp/static/js/skinRefApp/*.js'],
                    dest: 'skinRef/static_local/js/built/skinRefApp.built.js'
            },
        },
        cssmin: {
            options: {},
            target : {
                files: {
                    'skinRef/static/css/built.css': [
                        'public/lib/html5-boilerplate/dist/css/main.css',
                        'public/lib/html5-boilerplate/dist/css/normalize.css',
                        'public/lib/html5-boilerplate/dist/css/normalize.css',
                        'public/lib/bootstrap/dist/css/bootstrap.min.css',
                        'skinRef/skinRefApp/static/css/skinRefApp.css']
                }
            }

        },
        watch: {
            scripts:{
                files: ['skinRef/skinRefApp/static/js/skinRefApp/controller.js',
                        'skinRef/skinRefApp/static/js/skinRefApp/services.js',
                        'skinRef/skinRefApp/static/js/skinRefApp/directive.js',
                        'skinRef/skinRefApp/static/js/skinRefApp/table.js'



                ] ,
                tasks : ['concat'],
                option : {
                    spawn : false,
                }
            }
        },
        copy: {
            main : {
                files: [
                    {expand: true, cwd: 'public/lib/', src: ['components-font-awesome/**'], dest: 'skinRef/static/'},
                    {expand: true, cwd: 'public/lib/bootstrap/fonts/', src: ['**'], dest: 'skinRef/static/fonts/'}
                ]
            }
        }
        });

    // Load the plugin that provides the "uglify" task.

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['concat','cssmin','copy','watch']);

};
